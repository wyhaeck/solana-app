import algoliasearch from "algoliasearch";
import { TransactionType } from "../../types/TransactionType";

function getTransactionsFromAPI() {
  const transactionData = async () => {
    const response = await fetch("/api/database", {
      method: "GET",
    });
    return response.json();
  };
  return transactionData();
}

function transformTransactionsToSearchObjects(transactions: TransactionType[]) {
  const transformed = transactions.map((transaction: TransactionType) => {
    return {
      objectID: transaction.id,
      type: transaction.type,
      time: transaction.timestamp,
      from: transaction.from_acc,
      to: transaction.to_acc,
      amount: transaction.amount,
    };
  });

  return transformed;
}

(async function () {
  try {
    const transactions = await getTransactionsFromAPI();
    const transformed = transformTransactionsToSearchObjects(transactions);

    // initialize the client with your environment variables
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "",
      process.env.ALGOLIA_SEARCH_ADMIN_KEY ?? ""
    );

    // initialize the index with your index name
    const index = client.initIndex("solana_transactions");

    // save the objects!
    const algoliaResponse = await index.saveObjects(transformed);

    // check the output of the response in the console
    console.log(
      `🎉 Sucessfully added ${
        algoliaResponse.objectIDs.length
      } records to Algolia search. Object IDs:\n${algoliaResponse.objectIDs.join(
        "\n"
      )}`
    );
  } catch (error) {
    console.log(error);
  }
})();
