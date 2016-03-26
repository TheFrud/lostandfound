package models

/**
  * Created by Fredrik on 24-Mar-16.
  */

// Attention!
// This class contains a simple path to the image
// Used when saved to database
//

case class Annons(
                   id: Option[Long],
                   typ: String,
                   rubrik: String,
                   text: String,
                   hittelon: Option[Int],
                   coordslat: Option[BigDecimal],
                   coordslng: Option[BigDecimal],
                   img: String,
                   date: java.sql.Date,
                   category: String,
                   county: String,
                   uploader_name: String,
                   uploader_phone: String,
                   uploader_email: String,
                   uploader_password: String
                 )

// Attention!
// * This class contains an actual image
//   Used in the upload process
//
case class AnnonsForm(
                   id: Option[Long],
                   typ: String,
                   rubrik: String,
                   text: String,
                   hittelon: Option[Int],
                   coordslat: Option[BigDecimal],
                   coordslng: Option[BigDecimal],
                   img: Option[java.io.File],
                   date: java.sql.Date,
                   category: String,
                   county: String,
                   uploader_name: String,
                   uploader_phone: String,
                   uploader_email: String,
                   uploader_password: String
                 )

case class RemoveAnnonsForm(
                           password: String
                           )