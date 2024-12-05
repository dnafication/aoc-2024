/**
 * https://adventofcode.com/2024
 */

// Looks ugly and not optimized but it works

async function main() {
  try {
    const __dirname = new URL(".", import.meta.url).pathname;
    const data = await Deno.readTextFile(__dirname + "/input.txt");
    const rulesData = await Deno.readTextFile(__dirname + "/rules.txt");

    const printOrders = data.split("\n");
    console.log('Total Orders:', printOrders.length);
    const rules = rulesData.split("\n");

    const rulesCache = createRulesCache(printOrders, rules);
    const [validOrders, invalidOrders] = getValidOrders(printOrders, rulesCache);
    console.log('Valid Orders:', validOrders.length);
    console.log('Invalid Orders:', invalidOrders.length);

    const sumOfTheMiddleOfTheValidOrders = validOrders.reduce((acc, order) => {
      const items = order.split(",");
      const middleIndex = Math.floor(items.length / 2);
      return acc + parseInt(items[middleIndex]);
    }, 0);

    console.log('Part 1', sumOfTheMiddleOfTheValidOrders);

    const fixedInvalidOrders = invalidOrders.map((order) => {
      return sortPrintOrder(order, rulesCache);
    })

    const sumOfTheMiddleOfTheInvalidOrders = fixedInvalidOrders.reduce((acc, order) => {
      const items = order.split(",");
      const middleIndex = Math.floor(items.length / 2);
      return acc + parseInt(items[middleIndex]);
    }, 0);

    console.log('Part 2', sumOfTheMiddleOfTheInvalidOrders);

  } catch (error) {
    console.error(error);
  }
}

export function createRulesCache(printOrders: string[], rules: string[]): Map<string, string[]> {
  const rulesCache = new Map<string, string[]>();
  for (const order of printOrders) {
    const items = order.split(",");
    for (const item of items) {
      if (!rulesCache.has(item)) {
        rulesCache.set(item, rules.filter((rule) => rule.includes(item)));
      }
    }
  }
  return rulesCache;
}

export function getValidOrders(printOrders: string[], rulesCache: Map<string, string[]>): string[][] {
  const validOrders: string[] = [];
  const invalidOrders: string[] = [];
  for (const order of printOrders) {
    const items = order.split(",");
    let allRulesValid = true;
    for (const item of items) {
      const itemRules = rulesCache.get(item) || [];
      for (const rule of itemRules) {
        const [first, second] = rule.split("|");
        if (items.includes(first) && items.includes(second)) {
          if (!isInOrder([first, second], items)) {
            allRulesValid = false;
            invalidOrders.push(order);
            break;
          }
        }
      }
      if (!allRulesValid) break;
    }
    if (allRulesValid) {
      validOrders.push(order);
    }
  }
  return [validOrders, invalidOrders];
}

// Sort the order based on the rules
export function sortPrintOrder(printOrder: string, rulesCache: Map<string, string[]>): string {
  const items = printOrder.split(",");
  let sorted = false;

  while (!sorted) {
    sorted = true;
    for (let i = 0; i < items.length - 1; i++) {
      const itemRules = rulesCache.get(items[i]) || [];
      for (const rule of itemRules) {
        const [first, second] = rule.split("|");
        if (items.includes(first) && items.includes(second)) {
          const firstIndex = items.indexOf(first);
          const secondIndex = items.indexOf(second);
          if (firstIndex > secondIndex) {
            [items[firstIndex], items[secondIndex]] = [items[secondIndex], items[firstIndex]];
            sorted = false;
          }
        }
      }
    }
  }
  return items.join(",");
}

export function isInOrder(subArray: string[], mainArray: string[]): boolean {
  let subIndex = 0;
  for (const num of mainArray) {
    if (num === subArray[subIndex]) {
      subIndex++;
    }
    if (subIndex === subArray.length) {
      return true;
    }
  }
  return false;
}

main();
