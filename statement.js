function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);

  function enrichPerformance(aPerformance){
    const result = Object.assign({},aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);;
    return result;
  }

  return renderPlainText(statementData, plays)
}

function renderPlainText(data, plays) {
  let result = `청구 내역 (고객명: ${data.customer})\n`

  for (let perf of data.performances) {
    result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`
  }

  result += `총액: ${usd(totalAmount(data))}\n`
  result += `적립 포인트: ${totalVolumeCredits(data)}점\n`
  return result
}


function totalAmount(data) {
  let result = 0
  for (let perf of data.performances) {
    result += perf.amount
  }

  return result;
}

function totalVolumeCredits(data) {
  let volumeCredits = 0;
  for (let perf of data.performances) {
    volumeCredits += perf.volumeCredits;
  }

  return volumeCredits;
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



