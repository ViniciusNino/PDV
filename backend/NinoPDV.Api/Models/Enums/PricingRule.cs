namespace NinoPDV.Api.Models.Enums
{
    public enum PricingRule
    {
        Average = 0,          // Média de preços (ex: Pizza Meio a Meio)
        HighestPrice = 1,     // Maior valor (ex: Cobra a Pizza pelo sabor mais caro)
        Sum = 2,              // Soma os valores
        Minimum = 3           // Menor valor (Mínimo)
    }
}
