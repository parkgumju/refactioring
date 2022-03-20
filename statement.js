function statement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays))
}

function createStatementData(invoice, plays){
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData
}

function enrichPerformance(aPerformance){
  const result = Object.assign({},aPerformance);
  result.play = playFor(result);
  result.amount = amountFor(result);
  result.volumeCredits = volumeCreditsFor(result);;
  return result;
}

function renderHtml(data) {
  let result = `<h1>청구 내역 (고객명: ${data.customer})<h1>\n`;
  result += `<table>\n`;
  result += `<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>\n`;

  for (let perf of data.performances) {

    result += `<tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>\n`
    result += `<td>${usd(perf.amount)}</td></tr>\n`
  }
  result += `</table>\n`;
  result += `<p>총액: <em>${usd>(data.totalAmount)}</em></p>\n`
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`
  return result
}


function totalAmount(data) {
  return data.performances.reduce((total,p) => total + p.amount, 0);
}

function totalVolumeCredits(data) {
  return data.performances.reduce((total, p) => total + p.volumeCredits , 0);
}

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function volumeCreditsFor(perf) {
  let result = 0;
  result += Math.max(perf.audience - 30, 0)
  if (platFor(perf.type === 'comedy')) {
    result += Math.floor(perf.audience / 5);
  }
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function amountFor(aPerformance) {
  let result = 0;

  switch (playFor(aPerformance).type) {
    case 'tragedy':
      result = 40000
      if (aPerformance.audience > 30) result += 1000 * (aPerformance.audience - 30)
      break;
    case 'comedy':
      result = 30000
      if (aPerformance.audience > 20) result += 10000 + 500 * (aPerformance.audience - 20)
      result += 300 * aPerformance.audience
      break;
    default:
      throw new Error(`알 수 없는 장르: ${platFor(aPerformance).type}`)
  }

  return result;
}

let invoices = [
  {
    "customer": "BigCo",
    "performances": [
      {
        "playID": "hamlet",
        "audience": 55
      },
      {
        "playID": "as-like",
        "audience": 35
      },
      {
        "playID": "othello",
        "audience": 40
      }
    ]
  }
]

let plays = {
  "hamlet": {"name": "Hamlet", "type": "tragedy"},
  "as-like": {"name": "As You Like It", "type": "comedy"},
  "othello": {"name": "Othello", "type": "tragedy"}
}
invoices.forEach(invoice => {
  console.log(statement(invoice, plays))
})



