package controllers

import javax.inject._
import dao.{MyHash, AnnonsDAO}
import models.{RemoveAnnonsForm, AnnonsForm, Annons}
import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.mvc._
import play.api.Play.current
import play.api.i18n.Messages.Implicits._
import scala.concurrent.ExecutionContext.Implicits.global
import java.util.Random

import scala.concurrent.Future

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */

@Singleton
class HomeController @Inject() (annonsDao: AnnonsDAO) extends Controller {

  // Form stuff

  val removeAnnonsForm = Form(
    mapping(
      "password" -> text
    ) (RemoveAnnonsForm.apply)(RemoveAnnonsForm.unapply)
  )

  val annonsForm = Form(
    mapping(
      "id" -> optional(longNumber),
      "typ" -> text,
      "rubrik" -> text,
      "text" -> text,
      "hittelon" -> optional(number),
      "coordslat" -> optional(bigDecimal),
      "coordslng" -> optional(bigDecimal),
      "img" -> ignored(Option.empty[java.io.File]),
      "date" -> sqlDate,
      "category" -> text,
      "county" -> text,
      "uploader_name" -> text,
      "uploader_phone" -> text,
      "uploader_email" -> text,
      "uploader_password" -> text
    ) (AnnonsForm.apply)(AnnonsForm.unapply) verifying("Failed form constraints!", fields => fields match {
      case annons => validate(annons.id, annons.typ, annons.rubrik, annons.text, annons.hittelon,
        annons.coordslat, annons.coordslng, annons.date, annons.category, annons.county,
        annons.uploader_name, annons.uploader_phone, annons.uploader_email, annons.uploader_password).isDefined
    })
  )

  def validate(id: Option[Long], typ: String, rubrik: String, text: String, hittelon: Option[Int],
               coordslat: Option[BigDecimal], coordslng: Option[BigDecimal], sqlDate: java.sql.Date, category: String, county: String,
               uploader_name: String, uploader_phone: String, uploader_email: String, uploader_password: String) = {
    typ match {
      case "upphittat" =>
        Some(Annons(id, typ, rubrik, text, hittelon, coordslat, coordslng, "", sqlDate, category, county, uploader_name, uploader_phone, uploader_email, uploader_password))

      case "borttappat" =>
        Some(Annons(id, typ, rubrik, text, hittelon, coordslat, coordslng , "", sqlDate, category, county, uploader_name, uploader_phone, uploader_email, uploader_password))

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
      "img" -> annons.img,
      "date" -> annons.date,
      "category" -> annons.category,
      "county" -> annons.county,
      "uploader_name" -> annons.uploader_name,
      "uploader_phone" -> annons.uploader_phone,
      "uploader_email" -> annons.uploader_email
    )
  }

  implicit val personFormat = Json.format[Annons]


  // DATABASE SETUP
  def setupdb = Action {
    annonsDao.setupdb
    Ok("DB SETUP!")
  }

  // MAIN CONTROLLERS
  def index = Action.async { implicit request =>
    // val annonser = List(Annons(0, "upphittat", "Såg", "Hej jag hittade en såg i mitt garage!", Some(25)), Annons(1, "upphittat", "Katt", "En katt sprang in i mitt hus.", None), Annons(2, "borttappat", "Sax", "Hejsan text.", None))
    val annonser = annonsDao.getAllNoPasswords
    annonser.map(a => Ok(views.html.index(a)))
  }

  def laggTillAnnons = Action {
    Ok(views.html.lagg_till_annons(annonsForm))
  }

  def removeAnnons(id: Long) = Action.async { implicit  request =>

    removeAnnonsForm.bindFromRequest.fold(
      formWithErrors => {
        val annonser = annonsDao.getAnnonsById(id)
        val annons = annonser.map(annonser => annonser.head)
        annons.map { a => BadRequest(views.html.annons(a, formWithErrors))}
      },
      removeRequest => {
        // Check password
        println("Remove request password: "+removeRequest.password)
        // val hashedInput: String = MyHash.createPassword(removeRequest.password)
        val annonser = annonsDao.getAnnonsById(id)
        val annons = annonser.map(annonser => annonser.head)
        // a.uploader_password.equals(hashedInput)
        val isItTheSame: Future[Boolean] = annons.map {
          a => {
            MyHash.checkPassword(removeRequest.password, a.uploader_password)
          }
        }

        isItTheSame.map { l =>
          l match {
            case true => {
              val removedAnnons = annonsDao.remove(id)
              Redirect(routes.HomeController.index()).flashing("success" -> "Annons borttagen!")

            }
            case _ => {
              Redirect(routes.HomeController.index()).flashing("failure" -> "Fel lösenord!")
            }
          }
        }


      }
    )

  }

  def annonsPage(id: Long) = Action.async {
    // Find annons by id
    val annonser = annonsDao.getAnnonsById(id)
    val annons = annonser.map(annonser => annonser.head)
    annons.map(a => Ok(views.html.annons(a, removeAnnonsForm)))
  }

  def getAnnonser = Action.async {
    val annonser = annonsDao.getAllNoPasswords
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
          // Encrypt password
          val encrypted_password = MyHash.createPassword(annons.uploader_password)

          // Combine the file and form data...
          val withPicture = Annons(annons.id, annons.typ, annons.rubrik, annons.text, annons.hittelon,
            annons.coordslat, annons.coordslng, if(picture.filename.equals(""))annonsDao.defaultImgPath else filename, annons.date, annons.category, annons.county,
          annons.uploader_name, annons.uploader_phone, annons.uploader_email, encrypted_password)

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



