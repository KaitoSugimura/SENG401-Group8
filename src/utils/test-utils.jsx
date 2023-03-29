export class TimeStamp {
  constructor(seconds, nanoseconds) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }

  toDate() {
      const dateObj = new Date(this.toMillis())
      console.log(dateObj)
      return dateObj
  }

  toMillis() {
      return 1e3 * this.seconds + this.nanoseconds / 1e6;
  }
}