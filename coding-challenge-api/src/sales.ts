import csv from "csvtojson";
const ordersCsv = "./data/orders.csv";
const storesCsv = "./data/stores.csv";

interface order  {
  Id: string,
  storeId:string,
  orderId: string,
  latest_ship_date: string,
  shipment_status: string,
  destination: string,
  items: string,
  orderValue: string
  }

interface store {
  storeId: string,
  marketplace: string,
  country: string,
  shopName: string,
}

export async function getSales(req: any, res: any) {
  try {
    const orders = await csv().fromFile(ordersCsv);
    const stores = await csv().fromFile(storesCsv);

    const sales = orders.map((order: order) => {
      const storeData = stores.find(
        (store: store) => store.storeId === order.storeId
      );
      return { ...storeData, ...order };
    });
    res.json(sales);
  } catch (error) {
    res.status(500).send({ error: 'Cannot get orders' })
  }
}
