name := """lostandfound"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala, SbtWeb)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  cache,
  ws,
  filters,
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.0-RC1" % Test,
  "org.webjars" % "bootstrap" % "4.0.0-alpha.2",
  "com.typesafe.play" %% "play-slick" % "1.1.1",
  "com.typesafe.play" %% "play-slick-evolutions" % "1.1.1",
  "org.postgresql" % "postgresql" % "9.4-1201-jdbc41",
  "org.mindrot" % "jbcrypt" % "0.3m",
  "org.webjars" % "font-awesome" % "4.5.0",
  "org.webjars.bower" % "tether" % "1.1.1",
  "org.webjars.bower" % "imgLiquid" % "0.9.944",
  "org.webjars.bower" % "compass-mixins" % "0.12.7",
  "org.webjars" % "jquery-mobile" % "1.4.5"
)

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

pipelineStages := Seq(imagemin)

ImageMinKeys.progressive       := true  // lossless conversion to progressive JPEG images
ImageMinKeys.interlaced        := true  // interlaced GIF images
ImageMinKeys.optimizationLevel := 3     // optimization level 0 - 7 for PNG images
