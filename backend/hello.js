// const members = new Set(["shikhar", "argh", "mayank"]);
// console.log(typeof Array.from(members));

// const numbers = [45, 4, 9, 16, 25];
// const over18 = numbers.filter(myFunction);

// function myFunction(value, index) {
//   return value > 44;
// }

// console.log(over18);
// console.log(numbers);

// const numbers = new Array(1, 2, 3, 4);
// const squaredNumbers = numbers.map((u) => {
//   return u * 2;
// });

// console.log(squaredNumbers);
// console.log(numbers);

const ACTIVITY_TYPES = {
  CREATE_TASK: "CREATE_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  MOVE_TASK: "MOVE_TASK",
  CREATE_BOARD: "CREATE_BOARD",
  DELETE_BOARD: "DELETE_BOARD",
  UPDATE_BOARD: "UPDATE_BOARD",
  SEND_MESSAGE: "SEND_MESSAGE",
  DELETE_MESSAGE: "DELETE_MESSAGE",
  ADD_COMMENT: "ADD_COMMENT",
  DELETE_COMMENT: "DELETE_COMMENT",
  ADD_MEMBER: "ADD_MEMBER",
  REMOVE_MEMBER: "REMOVE_MEMBER",
};

// console.log({ ...ACTIVITY_TYPES });
console.log(Object.values(ACTIVITY_TYPES));
