const API_KEY =
  "9d12d92a1a640ab727a26ac44ad9571a33bf3f2b0c2cb3e641a2e133f1adf9be";

const tickersHandlers = new Map();

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = "5";

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
    MESSAGE: newMessage,
  } = JSON.parse(e.data);

  const handlers = tickersHandlers.get(currency) ?? [];

  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  handlers.forEach((fn) => fn(newPrice, newMessage));
});

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};

export const getListOfCoints = () => {
  const coints = [];
  fetch("https://min-api.cryptocompare.com/data/all/coinlist?summary=true")
    .then((c) => c.json())
    .then((t) => Object.values(t.Data).map((c) => coints.push(c.Symbol)));

  return coints;
};
