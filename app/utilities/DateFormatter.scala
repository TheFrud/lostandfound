package utilities

import java.text.{SimpleDateFormat}
import java.util.Locale

/**
  * Created by Fredrik on 07-Apr-16.
  */
object DateFormatter {

  val df = new SimpleDateFormat("dd-MM-yyyy")

  def format(sqlDate: java.sql.Date): String = {
    df.format(sqlDate)
  }

}
