package controllers

import java.io.{File, FileInputStream}
import java.net.{URL, URI}
import javax.imageio.ImageIO
import javax.inject._
import awscala.s3.S3
import com.amazonaws.regions.Region
import com.sksamuel.scrimage.ScaleMethod.FastScale
import com.sksamuel.scrimage._
import com.sksamuel.scrimage.nio.JpegWriter
import dao.{MyHash, AnnonsDAO}
import models.{RemoveAnnonsForm, Annons}
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.Play.current
import play.api.i18n.Messages.Implicits._
import scala.concurrent.ExecutionContext.Implicits.global
import java.util.Random
import play.api.mvc._
import play.api.routing._

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
      "img" -> text,
      "date" -> sqlDate,
      "category" -> text,
      "county" -> text,
      "uploader_name" -> text,
      "uploader_phone" -> text,
      "uploader_email" -> text,
      "uploader_password" -> text,
      "posted" -> ignored(annonsDao.getCurrentDate)
    ) (Annons.apply)(Annons.unapply)
  )


  /*
  verifying("Failed form constraints!", fields => fields match {
    case annons => validate(annons.id, annons.typ, annons.rubrik, annons.text, annons.hittelon,
      annons.coordslat, annons.coordslng, annons.date, annons.category, annons.county,
      annons.uploader_name, annons.uploader_phone, annons.uploader_email, annons.uploader_password).isDefined
  })
  */
  /*
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
  */

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
      "uploader_email" -> annons.uploader_email,
      "posted" -> annons.posted
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
    annonser.map { a =>  Ok(views.html.index(a))}
  }

  def laggTillAnnons = Action { implicit request =>
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

  def annonsPage(id: Long) = Action.async { implicit request =>
    // Find annons by id
    val annonser = annonsDao.getAnnonsById(id)
    val annons = annonser.map(annonser => annonser.head)
    annons.map(a => Ok(views.html.annons(a, removeAnnonsForm)))
  }

  def getAnnonser = Action.async { implicit request =>
    val annonser = annonsDao.getAllNoPasswords
    annonser.map {a => Ok(Json.obj("annonser" -> a))}
    //  futurePersons.map {persons => Ok(Json.obj("users" -> persons))}
  }

  // JSON SAK
  implicit val rds = (
    (__ \ 'id).read[Long]
    )

  def getAnnons = Action.async(parse.json) { request =>
    println(request.body)

    request.body.validate[(Long)].map{
      case id =>
        val annonser = annonsDao.getAnnonsById(id)
        val annons = annonser.map(annonser => annonser.head)
        annons.map(a => Ok(Json.obj("annons" -> a)))
    }.recoverTotal{
      e => Future{ BadRequest("Detected error:"+ JsError.toFlatJson(e)) }
    }

    // Find annons by id
    /*
    val annonser = annonsDao.getAnnonsById(annonsId)
    val annons = annonser.map(annonser => annonser.head)
    annons.map(a => Ok(Json.obj("annons" -> a)))
    */
  }

  def postAnnons = Action { implicit request =>

    annonsForm.bindFromRequest.fold(
      formWithErrors => {
        // binding failure, you retrieve the form containing errors:
        println("Annons could not be saved...")
        BadRequest(views.html.lagg_till_annons(formWithErrors))
      },
      annons => {
        // Encrypt password
        val encrypted_password = MyHash.createPassword(annons.uploader_password)

        // Check if an image was uploaded
        // If not the standard image will be used.
        val image = if(annons.img.equals("")) annonsDao.defaultImg else annons.img

        // Combine the file and form data...
        val annonsToSave = Annons(annons.id, annons.typ, annons.rubrik, annons.text, annons.hittelon,
          annons.coordslat, annons.coordslng, image, annons.date, annons.category, annons.county,
          annons.uploader_name, annons.uploader_phone, annons.uploader_email, encrypted_password, annons.posted)

        // Saving annons to database
        annonsDao.create(annonsToSave)

        println("Annons saved...")
        Redirect(routes.HomeController.index()) flashing ("message" -> "Annons skapad!")
      }
    )
  }

  def upload = Action(parse.multipartFormData) {implicit request =>
    println(request.body)
    request.body.file("img").map {
      picture => {
        val randomGenerator = new Random()
        val cleanedFileName = picture.filename.replaceAll("[^a-zA-Z0-9.-]", "_")
        val filename = randomGenerator.nextLong() + "_" + cleanedFileName
        val imagefolder = "app/assets/images/annons_imgs/"
        val imagepath = imagefolder + filename

        val imageFile = new java.io.File(imagepath)
        picture.ref.moveTo(imageFile)

        println("DEBUG: 1")

        // Check environment (local or production?)
        val inProduction = dao.AppStringResources.inProduction.get
        val environment = dao.AppStringResources.environment.get

        println("DEBUG: 2")

        // Setup Image Manipulation stuff
        implicit val writer = JpegWriter().withCompression(50)
        val in = new FileInputStream(imageFile) // input stream

        println("DEBUG: 22")

        // Fetch overlay img
        // Check if in production
        val bufferedImage = if(inProduction){

          println("DEBUG: 222")
          // Fetch overlay image from server
          // Adding the environment variable to the path
          println(environment+"/"+imagefolder + "image_overlay.png")
          // ImageIO.read(new File(environment+"/"+imagefolder + "image_overlay.png"))
          ImageIO.read(new URL(environment+"/"+imagefolder + "image_overlay.png").openStream())
        } else {

          // Fetch overlay image locally
          // No need to add the environment variable to the path
          ImageIO.read(new File(imagefolder + "image_overlay.png"))
        }

        println("DEBUG: 3")

        // Get the overlay image into a datatype we can handle
        val scrimage = com.sksamuel.scrimage.Image.awtToScrimage(bufferedImage)

        println("DEBUG: 4")

        // Save file
        val out = Image.fromStream(in).fit(300, 300).overlay(scrimage).output(new File(imagepath)) // output stream

        println("DEBUG: 5")

        // Are we in production?
        // If we are not, we are done here.
        if(inProduction){
          // If true (in production)

          // Setting up S3
          implicit val s3 = S3()
          val mybucket = s3.bucket("lostandfound-testbucket2")
          val b = mybucket.get
          println("DEBUG: 6")
          b.put(imagepath, new java.io.File(imagepath))
          println("DEBUG: 7")
        }

        Ok(filename)
      }
    }.getOrElse(BadRequest("Missing picture!"))


  }
  /*
  def upload = Action(parse.multipartFormData) {implicit request =>
    println(request.body)
    request.body.file("img").map {
      picture => {
        val randomGenerator = new Random()
        val cleanedFileName = picture.filename.replaceAll("[^a-zA-Z0-9.-]", "_")
        val filename = randomGenerator.nextLong() + "_" + cleanedFileName
        val imagefolder = sys.env("IMG_FOLDER")+ "/annons_imgs/"
        val imagepath = imagefolder + filename
        val imageFile = new java.io.File(imagepath)
        picture.ref.moveTo(imageFile)

        // S3 test
        implicit val s3 = S3()
        val mybucket = s3.bucket("lostandfound-testbucket2")
        val b = mybucket.get
        b.put("test.txt", new java.io.File("test.txt"))
        //


        // Fetch overlay img
        val bufferedImage = ImageIO.read(new File(imagefolder + "image_overlay.png"))
        val scrimage = com.sksamuel.scrimage.Image.awtToScrimage(bufferedImage)

        implicit val writer = JpegWriter().withCompression(50)
        val in = new FileInputStream(imageFile) // input stream
        val out = Image.fromStream(in).fit(300, 300).overlay(scrimage).output(new File(imagepath)) // output stream
        // val out = Image.fromStream(in).scaleTo(300, 200, FastScale).output(new File(imagepath)) // output stream

        Ok(filename)
      }
    }.getOrElse(BadRequest("Missing picture!"))


  }
*/
  def javascriptRoutes = Action { implicit request =>
    Ok(
      JavaScriptReverseRouter("jsRoutes")(
        routes.javascript.HomeController.getAnnonser,
        routes.javascript.HomeController.upload,
        routes.javascript.HomeController.index

      )
    ).as("text/javascript")
  }

}



