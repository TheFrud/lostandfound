package models

/**
  * Created by Fredrik on 24-Mar-16.
  */

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


case class RemoveAnnonsForm(
                           password: String
                           )