import bcrypt from 'bcrypt';

export async function createHashPassword(pswd) {
  const hashedPassword = await bcrypt.hash(pswd, 10);
  return hashedPassword;
}

createHashPassword
//log it

// (async () => {
//     console.log(await createHashPassword("password"));
// })();