package dao

import models.Annons
import slick.driver.JdbcProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
// import slick.driver.H2Driver.api._
import javax.inject.Inject

import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}

/**
 * Created by Fredrik on 11-Oct-15.
 */


class AnnonsDAO @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends HasDatabaseConfigProvider[JdbcProfile] {
  import driver.api._

  private val annonser = TableQuery[Annonser]

  private class Annonser(tag: Tag) extends Table[Annons] (tag, "ANNONSER") {
    def id = column[Long]("ANNONS_ID", O.PrimaryKey, O.AutoInc)
    def typ = column[String]("ANNONS_TYP")
    def rubrik = column[String]("ANNONS_RUBRIK")
    def text = column[String]("ANNONS_TEXT")
    def hittelon = column[Option[Int]]("ANNONS_HITTELON")
    def coordsLat = column[Option[BigDecimal]]("ANNONS_COORDS_LAT")
    def coordsLng = column[Option[BigDecimal]]("ANNONS_COORDS_LNG")
    def img = column[String] ("ANNONS_IMG")

    // def * = (id.?, name, age)
    def * = (id.?, typ, rubrik, text, hittelon, coordsLat, coordsLng, img) <> (Annons.tupled, Annons.unapply)
  }

  val defaultImgPath = "default.jpg"

  def setupdb = {

    try{

      val setup = DBIO.seq(
        // Create the tables, including primary and foreign keys
        annonser.schema.create,

        annonser ++= Seq(
          Annons(None, "upphittat", "Häst hittad!", "Hittade en häst på gården...", None, None, None, defaultImgPath),
          Annons(None, "borttappat", "Katt bortsprungen", "Kära Elsa är bortsprungen. Hjälp mig hitta henne.", None, None, None, defaultImgPath),
          Annons(None, "upphittat", "Väska", "En väska!", None, None, None, defaultImgPath),
          Annons(None, "borttappat", "Ring", "Tappade bort en ring. :(", None, None, None, defaultImgPath),
          Annons(None, "borttappat", "Kraftrör", "Kraftrör säger jag bara. Hjälp mig hitta det plx!", None, None, None, defaultImgPath)
        )

      )
      Await.result(db.run(setup), Duration.Inf)

    }finally println("DB Setup!")
  }

  def create(annons: Annons) = {
    try{
      val query = annonser ++= Seq(annons)
      val future = db.run(query)
      future.foreach(r => println("Inserted rows: " + r))
    }finally 1

  }

  def getAll: Future[List[Annons]] = {
    try{
      val query = annonser.result
      val future = db.run(query)
      val list = future.map(f => f.toList)
      list

    }finally 1
  }


  def getAnnonsById(id: Long): Future[List[Annons]] = {
    try{
      val annonser: Future[List[Annons]] = getAll
      val filtreradeAnnonser: Future[List[Annons]] = annonser.map{
        case l: List[Annons] => l.filter{_.id == Some(id)}
      }
      filtreradeAnnonser.map{
        case l: List[Annons] => {
          l
        }
      }
    }finally 1
  }


}
