package dao

import models.Annons
import slick.driver.JdbcProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
// import slick.driver.H2Driver.api._
import javax.inject.Inject
import java.sql.Date
import java.util.Date
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.io.UnsupportedEncodingException

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
    def date = column[java.sql.Date] ("ANNONS_DATE")
    def category = column[String] ("ANNONS_CATEGORY")
    def county = column[String] ("ANNONS_COUNTY")
    def uploader_name = column[String] ("ANNONS_UPLOADER_NAME")
    def uploader_phone = column[String] ("ANNONS_UPLOADER_PHONE")
    def uploader_email = column[String] ("ANNONS_UPLOADER_EMAIL")
    def uploader_password = column[String] ("ANNONS_UPLOADER_PASSWORD")
    def posted = column[java.sql.Date] ("ANNONS_POSTED")

    // def * = (id.?, name, age)
    def * = (id.?, typ, rubrik, text, hittelon, coordsLat, coordsLng, img, date, category, county, uploader_name, uploader_phone, uploader_email, uploader_password, posted) <> (Annons.tupled, Annons.unapply)
  }

  // Default image
  val defaultImg = "default.gif"

  def getCurrentDate = {
    val currentDateGetter = new java.util.Date
    val currentDate = new java.sql.Date(currentDateGetter.getTime())
    currentDate
  }

  def setupdb = {
    try{

      val setup = DBIO.seq(
        // Create the tables, including primary and foreign keys
        annonser.schema.create,

        annonser ++= Seq(
          Annons(None, "Upphittat", "Häst hittad!", "Hittade en häst på gården...", None, None, None, defaultImg, getCurrentDate, "Djur", "Gävleborgs län", "Fredrik Johansson", "0702915403", "thefrud@gmail.com", MyHash.createPassword("password1"), getCurrentDate),
          Annons(None, "Borttappat", "Katt bortsprungen", "Kära Elsa är bortsprungen. Hjälp mig hitta henne.", None, None, None, defaultImg, getCurrentDate, "Mobiltelefon", "Tuborgs län", "Fredrik Johansson", "0702915403", "thefrud@gmail.com", MyHash.createPassword("password2"), getCurrentDate),
          Annons(None, "Upphittat", "Väska", "En väska!", None, None, None, defaultImg, getCurrentDate, "Djur", "Gävleborgs län", "Fredrik Johansson", "0702915403", "thefrud@gmail.com", MyHash.createPassword("password3"), getCurrentDate),
          Annons(None, "Borttappat", "Ring", "Tappade bort en ring. :(", None, None, None, defaultImg, getCurrentDate, "Djur", "Kritvita län", "Fredrik Johansson", "0702915403", "thefrud@gmail.com", MyHash.createPassword("password4"), getCurrentDate),
          Annons(None, "Borttappat", "Kraftrör", "Kraftrör säger jag bara. Hjälp mig hitta det plx!", None, None, None, defaultImg, getCurrentDate, "Mobiltelefon", "Dagukar län", "Fredrik Johansson", "0702915403", "thefrud@gmail.com", MyHash.createPassword("password5"), getCurrentDate)
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

  def remove(id: Long): Future[Int] = {
    try {
      val q = annonser.filter(_.id === id)
      val action = q.delete
      val affectedRowsCount: Future[Int] = db.run(action)
      val sql = action.statements.head
      affectedRowsCount
    } finally 1
  }

  def getAll: Future[List[Annons]] = {
    try{
      val query = annonser.result
      val future = db.run(query)
      val list = future.map(f => f.toList)
      list

    }finally 1
  }

  def getAllNoPasswords: Future[List[Annons]] = {
    try{
      val query = annonser.result
      val future = db.run(query)
      val list = future.map(f => f.toList)

      // Remove the password from the list items
      val listNoPasswords = list.map {list => list.map {item => Annons(item.id, item.typ, item.rubrik, item.text, item.hittelon,
        item.coordslat, item.coordslng, item.img, item.date, item.category, item.county,
        item.uploader_name, item.uploader_phone, item.uploader_email, "", item.posted) } }

      // Return the list
      listNoPasswords

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
