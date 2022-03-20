function statement(invoice, plays) {
  let totalAmount = 0

  let result = `청구 내역 (고객명: ${invoice.customer})\n`

  for (let perf of invoice.performances) {
    result += `  ${platFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`
    totalAmount += amountFor(perf)
  }
  let volumeCredits = totalVolumeCredits(invoice);


  result += `총액: ${usd(totalAmount)}\n`
  result += `적립 포인트: ${volumeCredits}점\n`
  return result
}

function totalVolumeCredits(invoice){
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
  }

  return volumeCredits;
}
function usd(aNumber) {
  return  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber/ 100);
}

function volumeCreditsFor(perf){
  let volumeCredits = 0;
  volumeCredits += Math.max(perf.audience - 30, 0)
  if (platFor(perf.type === 'comedy')){
    volumeCredits += Math.floor(perf.audience / 5);
  }
  return volumeCredits;
}

function platFor(aPerformance){
  return  plays[aPerformance.playID];
}

function amountFor(aPerformance) {
  let result = 0;

  switch (platFor(aPerformance).type) {
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
  "hamlet": { "name": "Hamlet", "type": "tragedy" },
  "as-like": { "name": "As You Like It", "type": "comedy" },
  "othello": { "name": "Othello", "type": "tragedy" }
}
invoices.forEach(invoice => {
  console.log(statement(invoice, plays))
})



