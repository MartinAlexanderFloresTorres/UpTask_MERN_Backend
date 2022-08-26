import sgMail from "@sendgrid/mail";

// ENVIAR UN EMAIL DE CONFIRMACION DE CUENTA DEL REGISTRO
const emailRegistro = async (data) => {
  const { email, nombre, token } = data;

  const htmlConfirmar = `
  <div style="font-family: 'Open Sans','Roboto','Helvetica Neue',Helvetica,Arial,sans-serif; font-size: 16px; color: #757575; line-height: 150%; letter-spacing: normal;">
  <div style="background: #0284c7; padding: 50px 10px;">
  <div style="max-width: 600px; margin: auto;">
  <div style="background: white; padding: 15px 30px 25px 30px; border-radius: 5px;">
  <div style="text-align: center; margin: 20px 0 30px;"><span style="font-weight: bold; color: #0284c7; font-size: 30px; margin-left: 10px;">UpTask</span></div>
  <p style="color: #757575; font-family: 'Open Sans', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; letter-spacing: normal;">Hello ${nombre} comprueba tu cuenta en UpTask,</p>
  <p style="color: #757575; font-family: 'Open Sans', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; letter-spacing: normal;">Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace.</p>
  <p style="color: #757575; font-family: 'Open Sans', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; letter-spacing: normal;">Por favor confirme su correo electr&oacute;nico (<a href="mailto:${email}" target="_blank" rel="noopener">${email}</a>) haciendo clic en el bot&oacute;n de abajo.</p>
  <p><a style="background: #0284c7; color: white; font-weight: 500; display: inline-block; padding: 10px 35px; margin: 6px 8px; text-decoration: none; border-radius: 2px;" href="${process.env.FRONTEND_URL}/confirmar/${token}" target="_blank" rel="noopener">Confirmar</a></p>
  <p style="color: #757575; font-family: 'Open Sans', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; letter-spacing: normal;">En enlace expira inmediatamente cuando se abre.</p>
  <p style="color: #757575; font-family: 'Open Sans', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; letter-spacing: normal;">Si tu no creastes esta cuenta, puedes ignorar el mensaje.</p>
  </div>
  </div>
  </div>
  <div style="background: #0284c7; color: white; font-size: 12px; padding: 30px 10px 30px 10px;">
  <div style="max-width: 600px; margin: auto; text-align: center;"><hr style="border: 1px solid #f2f2f2;">
  <p style="font-style: italic; margin-bottom: 0;">Copyright &copy; 2022 UpTask, All rights reserved.</p>
  <p>Puedes visitar mi sitio web para mas informaci&oacute;n <a style="color: white;" href="http://whitecode.online" target="_blank" rel="noopener">whitecode</a></p>
  <hr style="border: 1px solid #f2f2f2;"></div>
  <div class="yj6qo">&nbsp;</div>
  <div class="adL">&nbsp;</div>
  </div>
  <div class="adL">&nbsp;</div>
  </div>
  `;

  sgMail.setApiKey(process.env.API_KEY);

  const msg = {
    to: email,
    from: "martinflorestorres21@gmail.com",
    subject: "Compruebe su cuenta en Uptask",
    text: "Uptask",
    html: htmlConfirmar,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email Enviado");
    })
    .catch((error) => {
      console.error(error);
    });
};

const emailOlvidePassword = async (data) => {
  const { email, nombre, token } = data;

  const htmlRestablecer = `
  <div style="font-family: 'Open Sans','Roboto','Helvetica Neue',Helvetica,Arial,sans-serif; font-size: 16px; color: #757575; line-height: 150%; letter-spacing: normal;">
  <div style="background: #0284c7; padding: 50px 10px;">
  <div style="max-width: 600px; margin: auto;">
  <div style="background: white; padding: 15px 30px 25px 30px; border-radius: 5px;">
  <div style="text-align: center; margin: 20px 0 30px;"><span style="font-weight: bold; color: #0284c7; font-size: 30px; margin-left: 10px;">Restablecer password en UpTask</span></div>
  <p style="color: #757575; font-family: 'Open Sans', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; letter-spacing: normal;">Hello ${nombre}&nbsp;</p>
  <p style="color: #757575; font-family: 'Open Sans', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; letter-spacing: normal;">Has solicitado restablecer tu password en UpsTask</p>
  <p>Sigue el siguiente enlace para generar un nuevo password:&nbsp;</p>
  <p style="color: #757575; font-family: 'Open Sans', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; letter-spacing: normal;"><a style="background: #0284c7; color: white; font-weight: 500; display: inline-block; padding: 10px 35px; margin: 6px 8px; text-decoration: none; border-radius: 2px;" href="${process.env.FRONTEND_URL}/olvide-password/${token}" target="_blank" rel="noopener">Restablecer password</a></p>
  <p style="color: #757575; font-family: 'Open Sans', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; letter-spacing: normal;">En enlace expira inmediatamente cuando se abre.</p>
  <p style="color: #757575; font-family: 'Open Sans', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; letter-spacing: normal;">Si tu no solicitastes este email, puedes ignorar el mensaje.</p>
  </div>
  </div>
  </div>
  <div style="background: #0284c7; color: white; font-size: 12px; padding: 30px 10px 30px 10px;">
  <div style="max-width: 600px; margin: auto; text-align: center;"><hr style="border: 1px solid #f2f2f2;">
  <p style="font-style: italic; margin-bottom: 0;">Copyright &copy; 2022 UpTask, All rights reserved.</p>
  <p>Puedes visitar mi sitio web para mas informaci&oacute;n <a style="color: white;" href="http://whitecode.online" target="_blank" rel="noopener">whitecode</a></p>
  <hr style="border: 1px solid #f2f2f2;"></div>
  <div class="yj6qo">&nbsp;</div>
  <div class="adL">&nbsp;</div>
  </div>
  <div class="adL" style="color: #757575; font-family: 'Open Sans', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; letter-spacing: normal;">&nbsp;</div>
  </div>
`;

  sgMail.setApiKey(process.env.API_KEY);

  const msg = {
    to: email,
    from: "martinflorestorres21@gmail.com",
    subject: "Restablecer password - uptask.",
    text: "Uptask",
    html: htmlRestablecer,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email Enviado");
    })
    .catch((error) => {
      console.error(error);
    });
};
export { emailRegistro, emailOlvidePassword };
