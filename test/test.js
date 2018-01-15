const Router = require("../src/index");
const redux = require("redux");
const configureStore = require("redux-mock-store").default;

const mockStore = configureStore([]);

describe("The air traffic control router", () => {

  it("should be constructable", () => {
    const store = mockStore({}, []);
    const router = new Router(store);
  });

});
