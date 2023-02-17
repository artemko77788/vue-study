<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            @input="inputChange"
            v-model="ticker"
            @keydown.enter="add"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="enter"
          />
        </div>

        <div
          class="flex bg-white p-1 rounded-md shadow-md flex-wrap"
          v-if="this.ticker"
        >
          <span
            v-for="t in filtered"
            :key="t"
            @click="add"
            class="items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
            >{{ t }}
          </span>
        </div>

        <div class="text-sm text-red-600" v-if="alert">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-button :disabled="ticker === ''" @click="add" />
  </section>
</template>

<script>
import AddButton from "./AddButton";
import { getListOfCoints } from "../src/api";

export default {
  components: {
    AddButton,
  },

  props: { tickers: { type: Array } },

  data() {
    return {
      ticker: "",
      alert: false,
      list: [],
    };
  },
  created() {
    this.list = getListOfCoints();
  },
  computed: {
    filtered() {
      return this.list
        .filter((s) => s.toUpperCase().includes(this.ticker.toUpperCase()))
        .slice(0, 4);
    },
  },

  methods: {
    inputChange() {
      this.alert = false;
    },

    add(e) {
      if (e.target.localName === "span") {
        this.ticker = e.target.innerText;
      }

      if (this.tickers.find((t) => t.name === this.ticker.toUpperCase())) {
        this.alert = true;
        return;
      }

      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
    },
  },
};
</script>
