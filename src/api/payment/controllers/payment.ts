/**
 * payment controller
 */
import { factories } from "@strapi/strapi";
import axios from "axios";

export default factories.createCoreController("api::payment.payment", ({ strapi }) => ({
  async processPayment(ctx) {
    try {
      const {
        token,
        amount,
        email,
        first_name,
        last_name,
        address,
        address_city,
        country_code,
        phone_number,
        dni,           // campo agregado
        metodo_envio,  // NUEVO: campo agregado
        order_items,   // NUEVO: datos de la orden (se espera un array JSON)
        subtotal,      // NUEVO: subtotal de la orden (en moneda, se convertirá a centavos)
        shipping_cost, // NUEVO: costo de envío (en moneda, se convertirá a centavos)
        total,         // NUEVO: total de la orden (en moneda, se convertirá a centavos)
      } = ctx.request.body;

      if (
        !token ||
        !amount ||
        !email ||
        !first_name ||
        !last_name ||
        !address ||
        !address_city ||
        !country_code ||
        !phone_number ||
        !dni ||
        !metodo_envio ||
        !order_items ||
        subtotal === undefined ||
        shipping_cost === undefined ||
        total === undefined
      ) {
        return ctx.badRequest("Faltan datos obligatorios");
      }

      // Intentar crear un cliente en Culqi
      let customer_id = null;
      let customer_data = null;
      try {
        const customerResponse = await axios.post(
          "https://api.culqi.com/v2/customers",
          {
            first_name,
            last_name,
            email,
            address,
            address_city,
            country_code,
            phone_number,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.CULQI_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        customer_id = customerResponse.data.id;
        customer_data = customerResponse.data;
      } catch (error) {
        console.error("Error al crear cliente en Culqi:", error.response?.data || error.message);
        // Si falla (por ejemplo, por duplicidad), se intenta obtener el cliente existente
        try {
          const listResponse = await axios.get("https://api.culqi.com/v2/customers", {
            headers: {
              Authorization: `Bearer ${process.env.CULQI_SECRET_KEY}`,
            },
          });
          const customers = listResponse.data.data; // Verifica que esta sea la estructura correcta
          const existingCustomer = customers.find((cust) => cust.email === email);
          if (existingCustomer) {
            customer_id = existingCustomer.id;
            customer_data = existingCustomer;
          }
        } catch (listError) {
          console.error("Error al listar clientes en Culqi:", listError.response?.data || listError.message);
        }
      }

      // Preparar el payload para el cargo, incluyendo customer_id si se obtuvo
      const chargePayload: Record<string, any> = {
        amount,
        currency_code: "PEN",
        email,
        source_id: token,
      };

      if (customer_id) {
        chargePayload.customer_id = customer_id;
      }

      // Enviar solicitud de pago a Culqi
      const response = await axios.post(
        "https://api.culqi.com/v2/charges",
        chargePayload,
        {
          headers: {
            Authorization: `Bearer ${process.env.CULQI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Guardar el pago en la base de datos de Strapi
      const paymentRecord = await strapi.entityService.create("api::payment.payment", {
        data: {
          token,
          email,
          amount,
          payment_status: response.data.status,
          culqi_response: response.data,
          customer_id,
          customer_data,
          first_name,
          last_name,
          address,
          address_city,
          country_code,
          phone_number,
          dni,
          metodo_envio,
        },
      });

      // Crear la orden en Strapi y asociarla al payment creado
      const ordenRecord = await strapi.entityService.create("api::orden.orden", {
        data: {
          customer_first_name: first_name,
          customer_last_name: last_name,
          email,
          phone_number,
          dni,
          address,
          address_city,
          country_code,
          metodo_envio,
          order_items, // se espera que sea un array JSON
          subtotal: Math.round(subtotal * 100),        // convertir a centavos
          shipping_cost: Math.round(shipping_cost * 100),// convertir a centavos
          total: Math.round(total * 100),              // convertir a centavos
          payment: paymentRecord.id, // se asocia el payment en el lado propietario
        },
        populate: ["payment"]
      });

      return ctx.send({
        message: "Pago y orden creados exitosamente",
        data: { payment: paymentRecord, orden: ordenRecord },
      });
    } catch (error) {
      console.error("Error en el pago:", error.response?.data || error.message);
      return ctx.badRequest("Error al procesar el pago");
    }
  },
}));
