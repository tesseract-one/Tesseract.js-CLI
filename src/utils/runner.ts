export type BaseContext = { currentDirPath: string }
// export type VoidResult = { __isVoid: true }

// export const Void: VoidResult = { __isVoid: true }

interface ITask<Context extends BaseContext, Result extends {}> {
  forward(context: Context): Promise<Result>
  backward(_: Context): Promise<void>
  rollback(context: Context): Promise<void>
}

export abstract class Task<Context extends {}, Result extends {}> implements ITask <Context & BaseContext, Result> {
  abstract forward(context: Context & BaseContext): Promise<Result>
  backward(_: Context & BaseContext): Promise<void> { return Promise.resolve() }
  rollback(context: Context & BaseContext): Promise<void> { return this.backward(context) }
}

export class Runner<Context extends BaseContext> {
  private tasks: Task<Context, any>[] = []
  private baseContext: BaseContext

  constructor(context: BaseContext) {
    this.baseContext = context
  }

  add<C extends Context, R extends {}>(Task: ITask<C, R>): Runner<Context & R> {
    this.tasks.push(Task)
    return this
  }

  async run(): Promise<void> {
    let index: number = 0
    let context = this.baseContext as Context
    try {
      for (; index < this.tasks.length; index++) {
        const patch = await this.tasks[index].forward(context)
        context = Object.assign(context, patch)
      }
    } catch(err) {
      console.error('Forward failed:', this.tasks[index].constructor.name, err)
      for (; index >= 0; index--) {
        try {
          await this.tasks[index].rollback(context)
        } catch (err) {
          console.error('Rollback failed:', this.tasks[index].constructor.name, err)
        }
      }
      return
    }
    for (index = this.tasks.length - 1; index >= 0; index--) {
      try {
        await this.tasks [index].backward(context)
      } catch(err) {
        console.error('Backward failed:', this.tasks[index].constructor.name, err)
      }
    }
  }
}
