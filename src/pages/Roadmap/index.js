// src/pages/Roadmap/index.js (ou Roadmap.jsx)
import React, { useState } from 'react';
import './index.css';

const Roadmap = () => {
  const [activeNodeId, setActiveNodeId] = useState(null); // ID do nó ativo para a barra lateral

  const roadmapNodes = [
     {
    id: 'ativos',
    title: '1. O que são Ativos Financeiros?',
    description:
      'Ativos financeiros são instrumentos que representam uma promessa de valor futuro. Eles podem gerar renda, proteger seu dinheiro ou valorizar ao longo do tempo. No seu cadastro de ativos, focaremos nos ativos financeiros de Renda Fixa. Você pode escolher entre três tipos: • Renda Fixa Bancária: CDB, LCI, LCA — emitidos por bancos. • Títulos Públicos: Como Tesouro Direto — emitidos pelo governo. • Debêntures e Créditos: Debêntures, CRI e CRA — emitidos por empresas. Embora alguns ativos sejam emitidos por empresas ou pelo governo, quem cadastra, distribui e oferece esses ativos ao investidor são bancos e instituições financeiras.',
    icon: '💰',
    resources: [
      { type: 'article', title: 'Renda fixa: o que é e como funciona?', link: 'https://blog.itau.com.br/artigos/renda-fixa' },
      { type: 'article', title: 'Mais sobre outros ativos financeiros', link: 'https://borainvestir.b3.com.br/glossario/ativos-financeiros/'},
    ],
  },
  {
  id: 'bancos',
  title: '2. Por que bancos comercializam ativos financeiros?',
  description: 
    'Bancos e instituições financeiras oferecem ativos porque essa é uma forma de captar dinheiro dos investidores. Quando você investe, por exemplo, em um CDB, está emprestando dinheiro para o banco, que usará esses recursos para financiar suas operações, conceder empréstimos ou investir em outros projetos. A diferença entre a taxa que o banco te paga e a que ele cobra nos empréstimos é chamada de spread bancário, que representa seu ganho pela intermediação financeira. Esse mecanismo também vale para o governo — com os títulos públicos — e para empresas — com debêntures e créditos —, com os bancos fazendo a intermediação, cadastro e distribuição dos ativos para os investidores.',
  icon: '🏦',
  resources: [
    { type: 'article', title: 'Como funcionam os bancos na prática', link: 'https://edumoreira.com.br/como-funcionam-os-bancos-na-pratica/'},
    { type: 'article', title: 'O papel dos bancos na sociedade', link: 'https://meubolsoemdia.com.br/paginas/papel-banco-sociedade' },
    { type: 'pdf', title: 'O que são os bancos? Cadernos BC - Série Educativa', link: 'https://www.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cadernos_BC-Serie_Educativa_para_criancas/bancos.pdf' },
  ],
  },
  {
    id: 'mercados',
    title: '3. O que é o mercado financeiro e como ele funciona?',
    description:
      'O mercado financeiro é onde acontece a negociação de ativos. É o ambiente que conecta quem tem dinheiro (investidores) com quem precisa de dinheiro (bancos, empresas e governo). Ele se divide em dois grandes ambientes: • Mercado primário: onde os ativos são emitidos pela primeira vez. Exemplo: um CDB que o banco cadastra e você compra, ou uma empresa que lança uma debênture. • Mercado secundário: onde os investidores podem negociar esses ativos entre si, antes do vencimento. Isso acontece, principalmente, na bolsa de valores, mas também pode ocorrer no mercado de balcão, que é uma negociação direta, fora da bolsa, geralmente intermediada por instituições financeiras. O mercado secundário na bolsa costuma ter mais liquidez, transparência e regras bem definidas. Já o balcão é mais comum para ativos como CDBs, LCIs, debêntures e CRIs, que você compra diretamente de um banco ou corretora, sem precisar de uma bolsa formal. O mercado financeiro permite que a economia funcione, financiando projetos, empresas e governos, enquanto oferece retorno para quem investe.',
    icon: '💵', 
    resources: [
      { type: 'article', title: 'O que é liquidez?', link: 'https://comoinvestir.anbima.com.br/escolha/compreensao-de-conceitos/o-que-e-liquidez-2/'},
      { type: 'article', title: 'Balcão x Bolsa. Qual a diferença?', link: 'https://blog.professorlucassilva.com.br/artigo/balcao-x-bolsa-qual-a-diferenca'},
      { type: 'article', title: 'Mercado Financeiro: o que é, como funciona e para que serve', link: 'https://content.btgpactual.com/blog/financas/mercado-financeiro'},
      { type: 'article', title: 'Mercado Financeiro: o que é e como funciona?', link: 'https://www.santander.com.br/blog/mercado-financeiro-o-que-e-como-funciona'},
    ],
  },
  {
    id: 'rentabilidade',
    title: '4. Como funciona a rentabilidade dos ativos?',
    description:
      'Quando você toma posse de um ativo financeiro, está buscando uma rentabilidade, ou seja, um retorno sobre o valor investido. Essa rentabilidade pode ser definida de três formas: • Prefixada: você sabe exatamente quanto vai receber no momento da aplicação. • Pós-fixada: acompanha um indicador econômico, como o CDI ou a SELIC. • Híbrida: combina uma taxa fixa mais um índice de inflação, como IPCA + juros.',
    icon: '📊',
    resources: [
      { type: 'article', title: 'Entenda o que são investimentos prefixados, pós-fixados e híbridos', link: 'https://comoinvestir.anbima.com.br/noticia/entenda-o-que-sao-investimentos-prefixados-pos-fixados-e-hibridos/' },
      { type: 'video', title: 'Entenda a Rentabilidade dos Investimentos', link: 'https://www.youtube.com/watch?v=dss4yx6HVl0&ab_channel=PrimoPobre' },
      { type: 'article', title: 'Indicadores financeiros: o que são Selic, IPCA e CDI?', link: 'https://www.sebraeprevidencia.com.br/planejar-dicas/122/Indicadores-financeiros:-o-que-' },
      { type: 'article', title: 'Indicadores econômicos em tempo real.', link: 'https://www.debit.com.br/tabelas/indicadores-economicos' },
    ],
  },
  {
    id: 'rentabilidade-e-prazos',
    title: '5. Como funcionam valor, prazo, rentabilidade, liquidez e risco?',
    description:
      'Todo ativo financeiro tem um valor unitário, que é o preço inicial da aplicação. A partir da data de emissão, esse valor começa a crescer de acordo com a taxa de rentabilidade contratada (Prefixada/ Pós-fixada/ Híbrida). O dinheiro rende até a data de vencimento, quando o emissor devolve seu valor atualizado. Alguns ativos oferecem liquidez diária, permitindo resgate antes do vencimento, enquanto outros só permitem resgate na data final. Quanto maior o risco do emissor, maior tende a ser a rentabilidade oferecida como compensação. Em geral: Bancos grandes + Títulos públicos: Baixo risco. Bancos médios/pequenos + Debêntures: Maior risco, mas oferecem rentabilidade maior (prêmio de risco).',
    icon: '📅',
    resources: [
      { type: 'video', title: 'Risco, Liquidez e Rentabilidade, o Tripé dos Investimentos.', link: 'https://www.youtube.com/watch?v=nbAaoDfSa1U&ab_channel=AmurCapital' },
      { type: 'video', title: 'Triângulo de Nigro: Rentabilidade, Risco e Liquidez', link: 'https://www.youtube.com/watch?v=Chlp4E8YQL0&ab_channel=OPrimoRico' },
    ],
  },
  {
    id: 'isento-impostos',
    title: '6. O que determina se um investimento é isento de impostos?',
    description:
      'Alguns investimentos oferecem isenção de impostos, e isso não é por acaso. A isenção é uma decisão do governo, que busca incentivar determinados setores da economia, como o agronegócio (CRA e LCA) e o mercado imobiliário (CRI e LCI). Títulos públicos, CDBs e debêntures comuns, por outro lado, são tributados pelo Imposto de Renda sobre os rendimentos. Essa isenção, no entanto, depende do tipo de investidor e da natureza da operação. Em geral, ela se aplica exclusivamente a pessoas físicas. Se o investidor for uma pessoa jurídica, normalmente não há isenção — mesmo em ativos que são livres de impostos para pessoas físicas. Entender quando e por que um ativo é isento ajuda a comparar melhor as opções e escolher de forma mais eficiente.',
    icon: '📜',
    resources: [
      { type: 'article', title: 'Tributação de Renda Fixa.', link: 'https://ajuda.modalmais.com.br/hc/pt-br/articles/1500000901041-Tributa%C3%A7%C3%A3o-de-Renda-Fixa' },
    ],
  },
    {
      id: 'campos',
      title: '7. Como aprender a cadastrar seu próprio ativo financeiro',
      description: 'Para gerenciar seus ativos, você preencherá campos específicos. A compreensão desses campos é fundamental para aprendermos enquanto interagimos no site.',
      icon: '📝',
      contentDetails: ( 
        <>
          <ul className="asset-fields-list">
            <li><strong>Nome:</strong> Identificação do ativo (ex: CDB Banco XYZ).</li>
            <li><strong>Tipo:</strong> Categoria (ex: Renda Fixa, Títulos Públicos, Debêntures e Créditos). Futuramente, a intenção é expandir as opções de ativos financeiros. </li>
            <li><strong>Emissor:</strong> Quem emitiu o ativo (ex: Banco ABC, Tesouro Nacional (Governo) etc).</li>
            <li><strong>Bolsa ou Balcão:</strong> Onde o ativo foi negociado — pode ser na bolsa de valores (como a B3) ou no mercado de balcão, que são negociações realizadas fora da bolsa, diretamente entre instituições.</li>
            <li><strong>Valor Unitário:</strong> É quanto custa uma unidade do ativo. Bancos e instituições definem esse valor, que pode variar de acordo com o tipo de investimento. Serve como base para calcular o total investido.</li>
            <li><strong>Quantidade: </strong> É o número de unidades emitidas para este ativo.</li>
            <li><strong>Tipo de Juros e Rentabilidade:</strong> Define como o rendimento do ativo é calculado. Pode ser: - Prefixado: A rentabilidade é conhecida desde o início (ex.: 12% ao ano). - Pós-fixado: O rendimento depende de um índice que varia ao longo do tempo (ex.: 100% do CDI). - Híbrido: Combina uma parte fixa com uma parte variável (ex.: IPCA + 6% ao ano).</li>
            <li><strong>Liquidez:</strong> Define a facilidade e o prazo para transformar o ativo em dinheiro disponível. Pode ser: Diária: Você pode resgatar a qualquer momento. Após o Vencimento: Somente na data de vencimento do ativo.</li>
            <li><strong>Data de Emissão:</strong> Data em que o ativo foi criado e passou a estar disponível para investidores.</li>
            <li><strong>Data de Vencimento:</strong> Data em que o ativo vence, ou seja, quando o emissor devolve seu dinheiro investido acrescido dos rendimentos.</li>
            <li><strong>Possui Imposto:</strong> Indica se o ativo está sujeito à cobrança de imposto, com alíquota especificada no campo correspondente.</li>
          </ul>
        </>
      ),
      resources: [
        { type: 'article', title: 'Mais sobre ativos financeiros', link: 'https://blog.eqseed.com/ativos-financeiros/' }
      ],
    },
    {
      id: 'calculadora',
      title: '8. Como funciona o cálculo de rendimento',
      description: 'Entenda como são feitos os cálculos de rendimento e valor investido dos ativos cadastrados.',
      icon: '🧮',
      contentDetails: (
        <>
          <ul className="asset-fields-list">
            <li><strong>Valor investido:</strong> Corresponde à multiplicação da quantidade de ativos pelo valor unitário. Fórmula: <em>valor_unitário × quantidade</em>.</li>
            <li><strong>Rendimento esperado:</strong> Simula o valor final bruto no vencimento considerando juros compostos. Varia conforme o tipo de juros:
              <ul>
                <li><strong>Prefixado:</strong> Cresce segundo uma taxa fixa anual. Fórmula: <em>Valor × (1 + taxa_fixa) ^ anos</em>.</li>
                <li><strong>Pós-fixado:</strong> Depende de um indexador (CDI, SELIC, IPCA ou IGPM) e um percentual sobre ele. Fórmula: <em>Valor × (1 + (percentual_sobre_indexador × indexador)) ^ anos</em>.</li>
                <li><strong>Híbrido:</strong> Soma uma taxa fixa mais um percentual sobre um indexador. Fórmula: <em>Valor × (1 + taxa_fixa + (percentual_sobre_indexador × indexador)) ^ anos</em>.</li>
              </ul>
            </li>
            <li><strong>Cálculo de resgate antecipado:</strong> Disponível apenas para ativos com liquidez diária. Calcula o valor acumulado até a data de resgate, considerando juros compostos proporcionais aos dias corridos desde a emissão.
            <p>No mundo real, o resgate antecipado pode gerar alguns tributos, como IOF (Imposto sobre Operações Financeiras), que incide sobre o valor resgatado proporcionalmente ao prazo da aplicação.</p>
            <p>Também pode haver cobrança de imposto de renda, que varia conforme o tempo que o dinheiro ficou investido — quanto mais tempo, menor é a porcentagem do imposto.</p>
            </li>
            <li><strong>Indexadores pré-definidos internamente:</strong> Atualmente simulados com valores fixos no sistema:
              <ul>
                <li><strong>CDI:</strong> 13% ao ano</li>
                <li><strong>SELIC:</strong> 12% ao ano</li>
                <li><strong>IPCA:</strong> 4% ao ano</li>
                <li><strong>IGPM:</strong> 6% ao ano</li>
              </ul>
              No futuro, esses valores podem ser conectados a APIs externas para refletir valores reais do mercado.
            </li>
          </ul>
        </>
      ),
      resources: [
        { type: 'article', title: 'Indicadores financeiros -  B3', link: 'https://www.b3.com.br/pt_br/market-data-e-indices/servicos-de-dados/market-data/consultas/mercado-de-derivativos/indicadores/indicadores-financeiros/' },
        { type: 'article', title: 'Tabela de Indicadores - Anbima', link: 'https://www.anbima.com.br/pt_br/informar/tabela-de-indicadores.htm' },
      ],
    },
  ];

  const activeNodeContent = roadmapNodes.find(node => node.id === activeNodeId);

  return (
    <div className="roadmap-page-wrapper roadmap-sh-style">
      <div className="roadmap-container roadmap-sh-container">
        <h1 className="roadmap-title">Roadmap</h1>
        <p className="roadmap-intro">
          A ideia é do Roadmap é entender mais de mercado financeiro e as motivações pelas quais existem ativos financeiros.
        </p>

        <div className="roadmap-content-flex">
          <div className="roadmap-main-content">
            <div className="roadmap-grid">
              {roadmapNodes.map((node, index) => (
                <React.Fragment key={node.id}>
                  <div
                    className={`roadmap-node-card ${activeNodeId === node.id ? 'active' : ''}`}
                    onClick={() => setActiveNodeId(node.id === activeNodeId ? null : node.id)}
                  >
                    <span className="node-card-icon">{node.icon}</span>
                    <h3 className="node-card-title">{node.title}</h3>
                  </div>
                  {index < roadmapNodes.length - 1 && (
                    <div className="roadmap-connector"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Sidebar de Recursos */}
          <div className={`resources-sidebar ${activeNodeId ? 'active' : ''}`}>
            {activeNodeContent && (
              <>
                <button className="close-sidebar-button" onClick={() => setActiveNodeId(null)}>X</button>
                <h2>{activeNodeContent.title}</h2>
                <p>{activeNodeContent.description}</p>
                {activeNodeContent.contentDetails && activeNodeContent.contentDetails}

                {activeNodeContent.resources.length > 0 && (
                  <>
                    <h3 className="resources-heading">🔗 Leia mais:</h3>
                    <ul className="resources-list">
                      {activeNodeContent.resources.map((resource, resIndex) => (
                        <li key={resIndex}>
                          <a href={resource.link} target="_blank" rel="noopener noreferrer">
                            <span className="resource-type">
                              {resource.type === 'article' && '📖'}
                              {resource.type === 'video' && '▶️'}
                              {resource.type === 'course' && '🎓'}
                              {resource.type === 'pdf' && '📕'}
                              {resource.type === 'tool' && '🛠️'}
                            </span>
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        </div> {/* Fim de roadmap-content-flex */}
      </div>
    </div>
  );
};

export default Roadmap;