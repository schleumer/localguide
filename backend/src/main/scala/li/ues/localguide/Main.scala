package li.ues.localguide

import akka.actor.typed.scaladsl.AskPattern._
import akka.actor.typed.scaladsl.{Behaviors, _}
import akka.actor.typed._
import com.softwaremill.macwire._

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.util.Random

object HelloWorld {
  def apply(): Behavior[SpawnProtocol.Command] =
    Behaviors.setup { context =>
      // Start initial tasks
      // context.spawn(...)

      SpawnProtocol()
    }
}

@Module
class Root {
  val system = ActorSystem(HelloWorld(), "root")
  val defaultTimeout = akka.util.Timeout(3.minutes)

  lazy val db = wire[Database]

  def spawn[T](behavior: Behavior[T], name: String, props: Props = Props.empty) = system.ask(
    (replyTo: ActorRef[ActorRef[T]]) => SpawnProtocol.Spawn(
      behavior = behavior,
      name = name,
      props = props,
      replyTo
    )
  )(defaultTimeout, system.scheduler)
}

class Database {
  val x: Long = Random.nextLong()
}

class Counter(val rootContext: ActorContext[String], db: Database) extends AbstractBehavior[String](rootContext) {
  override def onMessage(msg: String): Behavior[String] = Behaviors.setup { context =>
    println(db.x)
    Behaviors.receive[String] { (context, message) =>
      println((rootContext, context))
      if (message == "die") {
        Behaviors.stopped
      } else {
        Behaviors.same
      }
    }.receiveSignal {
      case x =>
        println(x)
        Behaviors.same
    }
  }
}

class Counter2(context: ActorContext[String], db: Database) extends AbstractBehavior[String](context) {
  override def onMessage(msg: String): Behavior[String] = Behaviors.setup { context =>
    println(db.x)
    Behaviors.receive[String] { (context, message) =>
      if (message == "die") {
        Behaviors.stopped
      } else {
        Behaviors.same
      }
    }.receiveSignal {
      case x =>
        println(x)
        Behaviors.same
    }
  }
}

object Main extends App {
  val root = wire[Root]

  implicit val scheduler = root.system.scheduler
  implicit val timeout = akka.util.Timeout(3.minutes)
  implicit val ec = root.system.executionContext

  val behavior1 = Behaviors.setup[String](_ => wire[Counter])

  val behavior2 = Behaviors.setup[String](_ => wire[Counter2])

  val res1: Future[ActorRef[String]] = root.spawn(
    behavior = behavior1,
    name = "xd1"
  )

  val res2: Future[ActorRef[String]] = root.spawn(
    behavior = behavior2,
    name = "xd2"
  )

  val ref1 = scala.concurrent.Await.result(res1, 3.minutes)
  val ref2 = scala.concurrent.Await.result(res2, 3.minutes)

  ref1 ! "lel"
  ref2 ! "lel"

  println(root.system.printTree)

  ref1 ! "die"
  ref2 ! "die"
}
