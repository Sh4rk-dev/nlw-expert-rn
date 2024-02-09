import { Alert, Linking, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { ProductCartProps, useCartStore } from "@/stores/cart-store";

import { formartCurrency } from "@/utils/functions/format-currency";

import { Header } from "@/components/header";
import { Product } from "@/components/product";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";
import { useState } from "react";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "0000000000000";

export default function Cart() {
  const [address, setAddress] = useState("");
  const cartStore = useCartStore();
  const navegation = useNavigation();

  const total = formartCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert("Remover", `Deseja remover esse ${product.title} do carrinho`, [
      {
        text: "Cancelar",
      },
      {
        text: "Remover",
        onPress: () => cartStore.remove(product.id),
      },
    ]);
  }

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert("Informe os dados da entrega");
    }

    const products = cartStore.products
      .map((product) => `\n ${product.quantity} ${product.title}`)
      .join("");

    const message = `
    🍔NOVO PEDIDO
    \n Entregar em: ${address}
    
    ${products}
    
    \nValor total: ${total}`;

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
    );
    cartStore.clear();
    navegation.goBack();
  }

  return (
    <View className="flex-1 pt-10">
      <Header title="Seu carrinho" />

      <KeyboardAwareScrollView showsHorizontalScrollIndicator={false}>
        <View className="p-5 flex-1">
          {cartStore.products.length > 0 ? (
            <View className="border-b border-slate-700">
              {cartStore.products.map((product) => (
                <Product
                  key={product.id}
                  data={product}
                  onPress={() => handleProductRemove(product)}
                />
              ))}
            </View>
          ) : (
            <Text className="font-body text-slate-400 text-center my-8">
              Seu carrinho está vazio.
            </Text>
          )}

          <View className="flex-row gap-2 items-center mt-5 mb-4">
            <Text className="text-white text-xl font-subtitle">Total:</Text>

            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
          </View>

          <Input
            placeholder="Informe o endereço de entrega comrua, bairro, CEP, número e complemento..."
            onChangeText={setAddress}
            onSubmitEditing={handleOrder}
            returnKeyType="next"
            blurOnSubmit
          />
        </View>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  );
}
