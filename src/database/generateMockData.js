// @flow
import chalk from "chalk";
import { Person } from "./";

export default async function generateMockData(
  forceInsert: boolean = false
): Promise<void> {
  if (forceInsert || (await Person.count()) === 0) {
    const { peopleDummy } = require("./dummy/");

    await Promise.all(
      peopleDummy.map(({ node: person }) =>
        Person.create({
          ...person,
          id: null,
          token: person.id,
          password: "password"
        })
      )
    );

    console.log(chalk.green.bold("All fields and connections are inserted"));
  }
  console.log(chalk.yellow.bold("Fields already in database, have fun"));
}
