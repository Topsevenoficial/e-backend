export default {
  routes: [
    {
      method: "POST",
      path: "/process-payment",
      handler: "payment.processPayment",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
