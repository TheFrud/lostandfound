package controllers

import javax.inject._
import models.Tables._
import models.UserData
import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.mvc._
import play.api.Play.current
import play.api.i18n.Messages.Implicits._
import scala.concurrent.ExecutionContext.Implicits.global

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */

@Singleton
class HomeController @Inject() extends Controller {

  // Form stuff

  val userForm = Form(
    mapping(
      "name" -> nonEmptyText,
      "age" -> number(min = 0, max = 100)
    )(UserData.apply)(UserData.unapply)
  )

  val annonsForm = Form(
    mapping(
      "id" -> optional(longNumber),
      "typ" -> text,
      "rubrik" -> text,
      "text" -> text,
      "hittelon" -> optional(number),
      "coordslat" -> optional(bigDecimal),
      "coordslng" -> optional(bigDecimal)
    ) (Annons.apply)(Annons.unapply) verifying("Failed form constraints!", fields => fields match {
      case annons => validate(annons.id, annons.typ, annons.rubrik, annons.text, annons.hittelon, annons.coordslat, annons.coordslng).isDefined
    })
  )

  def validate(id: Option[Long], typ: String, rubrik: String, text: String, hittelon: Option[Int], coordslat: Option[BigDecimal], coordslng: Option[BigDecimal]) = {
    typ match {
      case "upphittat" =>
        Some(Annons(id, typ, rubrik, text, hittelon, coordslat, coordslng))

      case "borttappat" =>
        Some(Annons(id, typ, rubrik, text, hittelon, coordslat, coordslng))

      case _ =>
        None
    }
  }

  // End of Form stuff



  // DATABASE SETUP
  def setupdb = Action {
    Annonser.setupdb
    Ok("DB SETUP!")
  }

  // MAIN CONTROLLERS
  def index = Action.async {
    // val annonser = List(Annons(0, "upphittat", "Såg", "Hej jag hittade en såg i mitt garage!", Some(25)), Annons(1, "upphittat", "Katt", "En katt sprang in i mitt hus.", None), Annons(2, "borttappat", "Sax", "Hejsan text.", None))
    val annonser = Annonser.getAll
    annonser.map(a => Ok(views.html.index(a)))
  }

  def laggTillAnnons = Action {
    Ok(views.html.lagg_till_annons(annonsForm))
  }

  def annonsPage(id: Long) = Action.async {
    // Find annons by id
    val annonser = Annonser.getAnnonsById(id)
    val annons = annonser.map(annonser => annonser.head)
    annons.map(a => Ok(views.html.annons(a)))
  }

  def postAnnons = Action { implicit request =>
    annonsForm.bindFromRequest.fold(
      formWithErrors => {
        // binding failure, you retrieve the form containing errors:
        println("Gick skit med formuläret")
        BadRequest(views.html.lagg_till_annons(formWithErrors))
      },
      annons => {
        /* binding success, you get the actual value. */
        Annonser.create(annons)
        println("Gick bra med formuläret")
        Redirect(routes.HomeController.index())flashing("message" -> "Annons skapad!")
      }
    )
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



