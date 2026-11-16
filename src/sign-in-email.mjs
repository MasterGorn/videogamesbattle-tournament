const copy = {
  fr: ['Ton lien de connexion', 'Ouvre ce lien dans le navigateur où tu l’as demandé.', 'Me connecter', 'Ce lien expire dans 15 minutes. Si tu n’as pas fait cette demande, ignore ce message.'],
  en: ['Your sign-in link', 'Open this link in the browser where you requested it.', 'Sign in', 'This link expires in 15 minutes. If you did not request it, ignore this message.'],
  es: ['Tu enlace de acceso', 'Abre este enlace en el navegador donde lo solicitaste.', 'Iniciar sesión', 'El enlace caduca en 15 minutos. Si no lo solicitaste, ignora este mensaje.'],
  pt: ['A tua ligação de acesso', 'Abre esta ligação no navegador onde a pediste.', 'Iniciar sessão', 'A ligação expira em 15 minutos. Se não a pediste, ignora esta mensagem.'],
  ja: ['ログインリンク', 'リンクをリクエストしたブラウザーで開いてください。', 'ログイン', 'リンクの有効期限は15分です。心当たりがない場合は、このメールを無視してください。'],
  zh: ['你的登录链接', '请在请求此链接的浏览器中打开它。', '登录', '此链接将在15分钟后失效。如果你没有发起请求，请忽略此邮件。'],
  de: ['Dein Anmeldelink', 'Öffne den Link in dem Browser, in dem du ihn angefordert hast.', 'Anmelden', 'Der Link ist 15 Minuten gültig. Falls du ihn nicht angefordert hast, ignoriere diese Nachricht.'],
  it: ['Il tuo link di accesso', 'Apri il link nel browser in cui lo hai richiesto.', 'Accedi', 'Il link scade tra 15 minuti. Se non lo hai richiesto, ignora questo messaggio.']
};

export function signInEmail(locale, escapedLink) {
  const [title, instructions, action, expiry] = typeof locale === 'string' && Object.hasOwn(copy, locale) ? copy[locale] : copy.fr;
  return {
    subject: `${title} · Video Games Battle`,
    html: `<h1>${title}</h1><p>${instructions}</p><p><a href="${escapedLink}">${action}</a></p><p>${expiry}</p>`
  };
}
