package dao


import org.mindrot.jbcrypt.BCrypt

/**
  * Created by Fredrik on 25-Mar-16.
  */
object MyHash {

  def createPassword(password: String): String ={
    BCrypt.hashpw(password, BCrypt.gensalt())
  }

  def checkPassword(candidate: String, encryptedPassword: String): Boolean ={
    BCrypt.checkpw(candidate, encryptedPassword)
  }

}
