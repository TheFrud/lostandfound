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
                   img: String
                 )

case class AnnonsForm(
                   id: Option[Long],
                   typ: String,
                   rubrik: String,
                   text: String,
                   hittelon: Option[Int],
                   coordslat: Option[BigDecimal],
                   coordslng: Option[BigDecimal],
                   img: Option[java.io.File]
                 )