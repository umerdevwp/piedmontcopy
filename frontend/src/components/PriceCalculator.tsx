import { useEffect, useState } from 'react';
import type { Product, OptionValue } from '../types';
import { cn } from '../utils/cn';
import { Check } from 'lucide-react';

interface PriceCalculatorProps {
    product: Product;
    onConfigurationChange: (config: Record<string, OptionValue>, price: number) => void;
}

export default function PriceCalculator({ product, onConfigurationChange }: PriceCalculatorProps) {
    const [selections, setSelections] = useState<Record<string, OptionValue>>({});
    const [totalPrice, setTotalPrice] = useState(product.basePrice);

    // Initialize defaults
    useEffect(() => {
        const defaults: Record<string, OptionValue> = {};
        product.options.forEach(opt => {
            defaults[opt.id] = opt.values[0];
        });
        setSelections(defaults);
    }, [product]);

    // Calculate Price
    useEffect(() => {
        let price = product.basePrice;

        Object.values(selections).forEach(val => {
            price += val.priceModifier;
            if (val.multiplier) {
                // Handle logic if multiplier applies to base or accumulated. 
                // For simplicity, we'll assume flat modifiers for now mostly.
            }
        });

        setTotalPrice(price);
        onConfigurationChange(selections, price);
    }, [selections, product, onConfigurationChange]);

    const handleSelect = (optionId: string, value: OptionValue) => {
        setSelections(prev => ({
            ...prev,
            [optionId]: value
        }));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-4">Configure Your Order</h3>

            <div className="space-y-6">
                {product.options.map(option => (
                    <div key={option.id}>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            {option.name}
                        </label>

                        {option.type === 'select' && (
                            <select
                                className="w-full border-slate-300 rounded-md shadow-sm focus:border-accent focus:ring-accent"
                                value={selections[option.id]?.id || ''}
                                onChange={(e) => {
                                    const val = option.values.find(v => v.id === e.target.value);
                                    if (val) handleSelect(option.id, val);
                                }}
                            >
                                {option.values.map(val => (
                                    <option key={val.id} value={val.id}>
                                        {val.name} {val.priceModifier > 0 ? `(+$${val.priceModifier.toFixed(2)})` : ''}
                                    </option>
                                ))}
                            </select>
                        )}

                        {option.type === 'radio' && (
                            <div className="grid grid-cols-2 gap-2">
                                {option.values.map(val => {
                                    const isSelected = selections[option.id]?.id === val.id;
                                    return (
                                        <button
                                            key={val.id}
                                            onClick={() => handleSelect(option.id, val)}
                                            className={cn(
                                                "relative flex items-center justify-between p-3 border rounded-lg text-sm transition-all",
                                                isSelected
                                                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                                                    : "border-slate-200 hover:border-slate-300"
                                            )}
                                        >
                                            <span className="font-medium text-slate-900">{val.name}</span>
                                            {isSelected && <Check className="h-4 w-4 text-accent" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-slate-600 text-sm">Estimated Total</span>
                    <span className="text-3xl font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                    *Production time estimated at 2-3 business days. Shipping calculated at checkout.
                </p>
            </div>
        </div>
    );
}
