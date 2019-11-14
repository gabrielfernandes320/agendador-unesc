import * as Yup from 'yup';

import Atividade from '../models/Atividade';

class AtividadeValidator {
  async store(req, res, next) {
    const schema = Yup.object().shape({
      nome: Yup.string()
        .max(100, 'O nome não pode exceder 100 caracteres')
        .required('É obrigatório informar o nome'),
      ativo: Yup.string()
        .required()
        .oneOf(['A', 'D'], 'Valor do ativo incorreto.'),
    });

    if (req.body.ativo) {
      req.body.ativo = req.body.ativo.toUpperCase();
    }

    try {
      await schema.validate(req.body);
    } catch (err) {
      const { path, errors, message } = err;
      return res.status(400).json({ path, errors, message });
    }

    return next();
  }

  async find(req, res, next) {
    const { id } = req.params;

    const atividade = await Atividade.findByPk(id);

    if (!atividade) {
      return res
        .status(400)
        .json({ message: 'Não foi encontrado atividade com a id informada.' });
    }

    req.atividadeId = atividade.id;

    return next();
  }
}

export default new AtividadeValidator();
