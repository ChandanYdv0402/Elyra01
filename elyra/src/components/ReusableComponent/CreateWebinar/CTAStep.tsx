// src/lib/ctaSteps.ts
export const ctaSteps = [
  {
    id: "basicInfo",
    title: "Basic Info",
    fields: [
      { name: "webinarName", label: "Webinar Name", type: "text", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "time", label: "Time", type: "time", required: true }
    ]
  },
  {
    id: "ctaOptions",
    title: "CTA Options",
    fields: [
      { name: "tags", label: "Tags", type: "tags", required: false },
      { name: "ctaLabel", label: "CTA Label", type: "text", required: true },
      { name: "ctaType", label: "CTA Type", type: "select", options: ["link","button"], required: true }
    ]
  },
  {
    id: "additionalInfo",
    title: "Additional Info",
    fields: [
      { name: "lockChat", label: "Lock Chat", type: "checkbox" },
      { name: "couponEnabled", label: "Enable Coupon", type: "checkbox" },
      { name: "couponCode", label: "Coupon Code", type: "text", required: false }
    ]
  }
];
