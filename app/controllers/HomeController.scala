package controllers

import javax.inject._
import dao.AnnonsDAO
import models.{AnnonsForm, Annons}
import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.mvc._
import play.api.Play.current
import play.api.i18n.Messages.Implicits._
import scala.concurrent.ExecutionContext.Implicits.global
import java.util.Random

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */

@Singleton
class HomeController @Inject() (annonsDao: AnnonsDAO) extends Controller {

  // Form stuff
  val annonsForm = Form(
    mapping(
      "id" -> optional(longNumber),
      "typ" -> text,
      "rubrik" -> text,
      "text" -> text,
      "hittelon" -> optional(number),
      "coordslat" -> optional(bigDecimal),
      "coordslng" -> optional(bigDecimal),
      "img" -> ignored(Option.empty[java.io.File])
    ) (AnnonsForm.apply)(AnnonsForm.unapply) verifying("Failed form constraints!", fields => fields match {
      case annons => validate(annons.id, annons.typ, annons.rubrik, annons.text, annons.hittelon, annons.coordslat, annons.coordslng).isDefined
    })
  )

  def validate(id: Option[Long], typ: String, rubrik: String, text: String, hittelon: Option[Int], coordslat: Option[BigDecimal], coordslng: Option[BigDecimal]) = {
    typ match {
      case "upphittat" =>
        Some(Annons(id, typ, rubrik, text, hittelon, coordslat, coordslng, ""))

      case "borttappat" =>
        Some(Annons(id, typ, rubrik, text, hittelon, coordslat, coordslng , ""))

      case _ =>
        None
    }
  }
  // End of Form stuff

  // JSON Stuff
  // JSON SAK
  implicit val annonsWrites = new Writes[Annons] {
    def writes(annons: Annons) = Json.obj(
      "id" -> annons.id,
      "typ" -> annons.typ,
      "rubrik" -> annons.rubrik,
      "text" -> annons.text,
      "hittelon" -> annons.hittelon,
      "coordsLat" -> annons.coordslat,
      "coordslng" -> annons.coordslng,
      "img" -> annons.img
    )
  }

  implicit val personFormat = Json.format[Annons]


  // DATABASE SETUP
  def setupdb = Action {
    annonsDao.setupdb
    Ok("DB SETUP!")
  }

  // MAIN CONTROLLERS
  def index = Action.async {
    // val annonser = List(Annons(0, "upphittat", "Såg", "Hej jag hittade en såg i mitt garage!", Some(25)), Annons(1, "upphittat", "Katt", "En katt sprang in i mitt hus.", None), Annons(2, "borttappat", "Sax", "Hejsan text.", None))
    val annonser = annonsDao.getAll
    annonser.map(a => Ok(views.html.index(a)))
  }

  def laggTillAnnons = Action {
    Ok(views.html.lagg_till_annons(annonsForm))
  }

  def annonsPage(id: Long) = Action.async {
    // Find annons by id
    val annonser = annonsDao.getAnnonsById(id)
    val annons = annonser.map(annonser => annonser.head)
    annons.map(a => Ok(views.html.annons(a)))
  }

  def getAnnonser = Action.async {
    val annonser = annonsDao.getAll
    annonser.map {a => Ok(Json.obj("annonser" -> a))}
    //  futurePersons.map {persons => Ok(Json.obj("users" -> persons))}
  }

  def postAnnons = Action(parse.multipartFormData) { implicit request =>
    request.body.file("img").map { picture =>
      // retrieve the image and put it where you want...
      val randomGenerator = new Random()
      val cleanedFileName = picture.filename.replaceAll("[^a-zA-Z0-9.-]", "_")
      val filename = randomGenerator.nextLong() + "_" + cleanedFileName
      val imagepath = "public/images/annons_imgs/" + filename
      val imageFile = new java.io.File(imagepath)
      picture.ref.moveTo(imageFile)

      annonsForm.bindFromRequest.fold(
        formWithErrors => {
          // binding failure, you retrieve the form containing errors:
          println("Gick skit med formuläret")
          BadRequest(views.html.lagg_till_annons(formWithErrors))
        },
        annons => {
          // Combine the file and form data...
          val withPicture = Annons(annons.id, annons.typ, annons.rubrik, annons.text, annons.hittelon, annons.coordslat, annons.coordslng, if(picture.filename.equals(""))annonsDao.defaultImgPath else filename)
          annonsDao.create(withPicture)
          println("Gick bra med formuläret")
          Redirect(routes.HomeController.index()) flashing ("message" -> "Annons skapad!")
        }
      )
    }.getOrElse(BadRequest("Missing Picture"))
  }

  def upload = Action(parse.multipartFormData) { request =>
    request.body.file("picture").map { picture =>
      import java.io.File
      val filename = picture.filename
      val contentType = picture.contentType
      picture.ref.moveTo(new File(s"tmp/picture/$filename"))
      Ok("File uploaded")
    }.getOrElse {
      Redirect(routes.HomeController.index).flashing(
        "error" -> "Missing file")
    }
  }

}



