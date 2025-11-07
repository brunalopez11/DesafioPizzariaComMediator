// 1. DESAFIO MEDIADOR PIZZARIA
class PizzariaCentral {
  constructor() {
    this.componentes = new Set();
    this.fila = [];
    this.livre = true;
  }

  registrar(comp) {
    comp.setMediator(this);
    this.componentes.add(comp);
  }

  buscar(nome) {
    return [...this.componentes].find(c => c.nome === nome);
  }

  notificar(remetente, tipo, dados = {}) {
    const prioridade = dados.urgente ? 0 : 1;
    const evento = { remetente, tipo, dados, prioridade };

    // Urgentes vão para o início da fila
    if (prioridade === 0) this.fila.unshift(evento);
    else this.fila.push(evento);

    this.processar();
  }

  processar() {
    if (!this.livre || this.fila.length === 0) return;
    this.livre = false;

    const { remetente, tipo, dados } = this.fila.shift();

    switch (tipo) {
      case "novo_pedido": {
        console.log(`Garçom recebeu pedido: ${dados.pizza} (Mesa ${dados.mesa})`);
        const cozinha = this.buscar("Cozinha");
        setTimeout(() => {
          cozinha.preparar(dados);
          this.liberar();
        }, 2000);
        break;
      }

      case "cozinha_ok": {
        const forno = this.buscar("Forno");
        console.log(`Cozinha terminou: ${dados.pizza}`);
        setTimeout(() => {
          forno.assar(dados);
          this.liberar();
        }, 2000);
        break;
      }

      case "forno_ok": {
        const caixa = this.buscar("Caixa");
        console.log(`Pizza assada: ${dados.pizza}`);
        setTimeout(() => {
          caixa.cobrar(dados);
          this.liberar();
        }, 2000);
        break;
      }

      case "pagamento_ok": {
        const entrega = this.buscar("Entrega");
        console.log(`Pagamento confirmado da mesa ${dados.mesa}`);
        setTimeout(() => {
          entrega.entregar(dados);
          this.liberar();
        }, 2000);
        break;
      }

      case "entrega_ok": {
        console.log(`Pedido entregue: ${dados.pizza} (Mesa ${dados.mesa})`);
        this.liberar();
        break;
      }

      default:
        console.log("Evento desconhecido:", tipo);
        this.liberar();
    }
  }

  liberar() {
    this.livre = true;
    this.processar();
  }
}

// 2. CLASSE BASE
class Componente {
  constructor(nome) {
    this.nome = nome;
    this.mediator = null;
  }

  setMediator(m) {
    this.mediator = m;
  }

  receber(msg) {
    console.log(`[${this.nome}] ${msg}`);
  }
}

// 3. COMPONENTES ESPECÍFICOS
class Garcom extends Componente {
  constructor() {
    super("Garcom");
  }

  novoPedido(pizza, mesa, urgente = false) {
    this.mediator.notificar(this, "novo_pedido", { pizza, mesa, urgente });
  }
}

class Cozinha extends Componente {
  constructor() {
    super("Cozinha");
  }

  preparar(dados) {
    console.log(`Cozinha preparando ${dados.pizza}...`);
    setTimeout(() => {
      this.mediator.notificar(this, "cozinha_ok", dados);
    }, 2000);
  }
}

class Forno extends Componente {
  constructor() {
    super("Forno");
  }

  assar(dados) {
    console.log(`Forno assando ${dados.pizza}...`);
    setTimeout(() => {
      this.mediator.notificar(this, "forno_ok", dados);
    }, 2000);
  }
}

class Caixa extends Componente {
  constructor() {
    super("Caixa");
  }

  cobrar(dados) {
    console.log(`Caixa cobrando pedido da mesa ${dados.mesa}...`);
    setTimeout(() => {
      this.mediator.notificar(this, "pagamento_ok", dados);
    }, 2000);
  }
}

class Entrega extends Componente {
  constructor() {
    super("Entrega");
  }

  entregar(dados) {
    console.log(`Entregando ${dados.pizza} para mesa ${dados.mesa}...`);
    setTimeout(() => {
      this.mediator.notificar(this, "entrega_ok", dados);
    }, 2000);
  }
}

// 4. DEMONSTRAÇÃO
(function simulacao() {
  const pizzaria = new PizzariaCentral();

  const garcom = new Garcom();
  const cozinha = new Cozinha();
  const forno = new Forno();
  const caixa = new Caixa();
  const entrega = new Entrega();

  [garcom, cozinha, forno, caixa, entrega].forEach(c => pizzaria.registrar(c));

  // Três pedidos — um deles urgente
  garcom.novoPedido("Pizza Calabresa", 1);
  garcom.novoPedido("Pizza Quatro Queijos", 2);
  garcom.novoPedido("Pizza Marguerita", 3, true); // urgente!
})();
