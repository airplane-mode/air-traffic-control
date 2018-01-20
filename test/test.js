const { Router } = require("../build/air-traffic-control.js"); // eslint-disable-line import/no-unresolved
const configureStore = require("redux-mock-store").default;

const mockStore = configureStore([]);

describe("The air traffic control router", () => {
  it("should be constructable", () => {
    const store = mockStore({}, []);
    const router = new Router(store); // eslint-disable-line no-unused-vars
  });
});
