import bcrypt from 'bcrypt';

export async function createHashPassword(pswd) {
  const hashedPassword = await bcrypt.hash(pswd, 10);
  return hashedPassword;
}

//log it

// (async () => {
//   console.log(await createHashPassword("pass"));
// })();




async function bcryptCompare(plainPassword, hashedPassword) {
  try {
      return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
      console.error("Error comparing passwords:", error);
      return false;
  }
}

//log it
// (async () => {
//   const plainPassword = "password"; // text 
//   const hashedPassword = "$2b$10$rXUPHjaSeqn9ZEY6y8JIhu/s.TKahdNOMCNirntuLzxVc5elTlRaC"; // hashed

//   const isMatch = await bcryptCompare(plainPassword, hashedPassword);
//   console.log("Passwords match:", isMatch);
// })();
