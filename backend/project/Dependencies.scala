import sbt._

object Dependencies {
  lazy val scalaTest = "org.scalatest" %% "scalatest" % "3.2.2"

  lazy val macwire = Seq(
    "com.softwaremill.macwire" %% "macros" % "2.3.7",
    "com.softwaremill.macwire" %% "macrosakka" % "2.3.7",
    "com.softwaremill.macwire" %% "util" % "2.3.7",
    "com.softwaremill.macwire" %% "proxy" % "2.3.7"
  )

  lazy val akka = Seq(
    "com.typesafe.akka" %% "akka-actor-typed" % "2.6.10",
    "com.typesafe.akka" %% "akka-stream" % "2.6.10",
    "com.typesafe.akka" %% "akka-http" % "10.2.2"
  )
}
