package models

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
// import slick.driver.H2Driver.api._
import slick.driver.PostgresDriver.api._

/**
 * Created by Fredrik on 11-Oct-15.
 */
object Tables {

  case class Annons(
                     id: Option[Long],
                     typ: String,
                     rubrik: String,
                     text: String,
                     hittelon: Option[Int],
                     coordslat: Option[BigDecimal],
                     coordslng: Option[BigDecimal]
                   )

  class Annonser(tag: Tag) extends Table[Annons] (tag, "ANNONSER") {
    def id = column[Long]("ANNONS_ID", O.PrimaryKey, O.AutoInc)
    def typ = column[String]("ANNONS_TYP")
    def rubrik = column[String]("ANNONS_RUBRIK")
    def text = column[String]("ANNONS_TEXT")
    def hittelon = column[Option[Int]]("ANNONS_HITTELON")
    def coordsLat = column[Option[BigDecimal]]("ANNONS_COORDS_LAT")
    def coordsLng = column[Option[BigDecimal]]("ANNONS_COORDS_LNG")

    // def * = (id.?, name, age)
    def * = (id.?, typ, rubrik, text, hittelon, coordsLat, coordsLng) <> (Annons.tupled, Annons.unapply)
  }

  object Annonser {

    val db = Database.forConfig("postdb")
    def setupdb = {
      try{

        val setup = DBIO.seq(
          // Create the tables, including primary and foreign keys
          annonser.schema.create,

          annonser ++= Seq(
            Annons(None, "upphittat", "Häst hittad!", "Hittade en häst på gården...", None, None, None),
            Annons(None, "borttappat", "Katt bortsprungen", "Kära Elsa är bortsprungen. Hjälp mig hitta henne.", None, None, None),
            Annons(None, "upphittat", "Väska", "En väska!", None, None, None),
            Annons(None, "borttappat", "Ring", "Tappade bort en ring. :(", None, None, None),
            Annons(None, "borttappat", "Kraftrör", "Kraftrör säger jag bara. Hjälp mig hitta det plx!", None, None, None)
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

  val annonser = TableQuery[Annonser]

}
