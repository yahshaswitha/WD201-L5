// models/todo.js
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
     static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overDueItems = await Todo.overdue();
      overDueItems.forEach((todoItem) =>
        console.log(todoItem.displayableString())
      );
      console.log("\n");

      console.log("Due Today");
      const duetodayItems = await Todo.dueToday();
      duetodayItems.forEach((todoItem) =>
        console.log(todoItem.displayableString())
      );
      console.log("\n");

      console.log("Due Later");
      const duelaterItems = await Todo.dueLater();
      duelaterItems.forEach((todoItem) =>
        console.log(todoItem.displayableString())
      );
    }

    static async overdue() {
      const overDueItems = await Todo.findAll({
        where: { dueDate: { [Op.lt]: new Date() } },
        order: [["id", "ASC"]],
      });

      return overDueItems;
    }

    static async dueToday() {
      const duetodayItems = await Todo.findAll({
        where: { dueDate: new Date() },
        order: [["id", "ASC"]],
      });

      return duetodayItems;
    }

    static async dueLater() {
      const duelaterItems = await Todo.findAll({
        where: { dueDate: { [Op.gt]: new Date() } },
        order: [["id", "ASC"]],
      });

      return duelaterItems;
    }

    static async markAsComplete(id) {
      await Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );

    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let displDate =
        this.dueDate === new Date().toLocaleDateString("en-CA")
          ? ""
          : this.dueDate;
          return `${this.id}. ${checkbox} ${this.title} ${displDate}`.trim();
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
