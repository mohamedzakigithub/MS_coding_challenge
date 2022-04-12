const csv = require("csvtojson");
const ordersCsv = "./data/orders.csv";
const storesCsv = "./data/stores.csv";

export async function getSales(req: any, res: any) {
  const orders = await csv().fromFile(ordersCsv);
  const stores = await csv().fromFile(storesCsv);

  const sales = orders.map((order: any) => {
    const storeData = stores.find(
      (store: any) => store.storeId === order.storeId
    );
    return { ...storeData, ...order };
  });
  res.json(sales);
}
