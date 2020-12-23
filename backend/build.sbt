import Dependencies._

ThisBuild / scalaVersion     := "2.13.4"
ThisBuild / version          := "0.1.0-SNAPSHOT"
ThisBuild / organization     := "li.ues"
ThisBuild / organizationName := "localguide"

lazy val migrateLocal = (project in file("./db"))
  .settings(
    name := "migrateLocal",
    libraryDependencies += "org.postgresql" % "postgresql" % "42.2.18",
    flywayUrl := "jdbc:postgresql://localhost/localguide",
    flywayUser := "localguide",
    flywayPassword := "123456",
    flywayLocations := Seq("filesystem:"+file("./db/migration").getAbsolutePath )
  )
  .enablePlugins(FlywayPlugin)

lazy val root = (project in file("."))
  .settings(
    name := "root",
    libraryDependencies ++= macwire ++ akka,
    libraryDependencies += scalaTest % Test,
  )

// See https://www.scala-sbt.org/1.x/docs/Using-Sonatype.html for instructions on how to publish to Sonatype.
