export const throwError = (code, msg) => {
  const error = new Error(msg)
  error.code = code
  throw error
}

export const controllerErrorHanlder = (err, res, defaultMessage) => {
  console.error('error  :  ', err)
  return res.status(err?.code ?? 500).send({
    code: err?.code ?? 500,
    message: err?.message ?? defaultMessage
  })
}
