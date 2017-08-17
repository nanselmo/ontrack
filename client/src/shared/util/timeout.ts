export default class Timeout {

  public start(): void {
    this.timerInstance = setTimeout(this.callback, this.delay);
  }
  public cancel(): void {
    if (this.hasStarted()) {
      clearTimeout(this.timerInstance);
    }
  }
  public hasStarted(): boolean {
    return this.timerInstance !== null;
  }
  public hasFinished(): boolean {
    return this.callbackExecuted;
  }

  constructor(callback: Function, delay: number) {
    this.callback = () => {
      this.callbackExecuted = true;
      callback();
    }
    this.delay = delay;
  }

  private timerInstance: any = null;
  private callback: Function;
  private delay: number;
  private callbackExecuted: boolean = false;

}
