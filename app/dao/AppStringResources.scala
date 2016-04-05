package dao

import com.google.inject.Inject
import play.api.Configuration
import play.api.Play.current

/**
  * Created by Fredrik on 04-Apr-16.
  */

/*



*/
/*
class AppStringResources @Inject()(config: Configuration) {

val configValue: String = config.underlying.getString("app.environment")

}
*/

object AppStringResources {

    val environment = current.configuration.getString("app.environment")
    val imagepath = current.configuration.getString("app.imagepath")
    val inProduction = current.configuration.getBoolean("app.inproduction")

}
