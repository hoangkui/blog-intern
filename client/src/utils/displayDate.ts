import moment from "moment";

export default (date: Date) => {
  return moment(date).calendar();
};
