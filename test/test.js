const Router = require("../src/index");
const redux = require("redux");
const configureStore = require("redux-mock-store").default;

describe("The air traffic control router", () => {

  it("should be constructable", () => {
    const store = configureStore({}, []);
    const router = new Router(store);
  });

});
