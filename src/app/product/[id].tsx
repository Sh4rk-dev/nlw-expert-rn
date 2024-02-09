import { Image, Text, View, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useLocalSearchParams, useNavigation } from "expo-router";

import { useCartStore } from "@/stores/cart-store";

import { PRODUCTS } from "@/utils/data/products";
import { formartCurrency } from "@/utils/functions/format-currency";
import { Button } from "@/components/button";
import { LinkButton } from "@/components/link-button";

export default function Product() {
  const cartStore = useCartStore();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const product = PRODUCTS.find((item) => item.id === id);

  function handleAddToCart() {
    if (product) {
      cartStore.add(product);
      navigation.goBack();
    }
  }

  if (!product) {
    return <Redirect href={"/"} />;
  }
  return (
    <View className="flex-1">
      <Image
        source={product.cover}
        className="w-full h-52"
        resizeMode="cover"
      />

      <View className="p-5 mt-8 flex-1">
        <Text className="text-2xl font-medium text-gray-100">
          {product.title}
        </Text>
        <Text className="text-lime-400 text-2xl font-heading my-2">
          {formartCurrency(product.price)}
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-slate-400 font-body text-base leading-6 mb-6">
            {product.description}
          </Text>

          <Text className="font-heading text-slate-200 text-xl my-2">
            Ingredientes
          </Text>

          {product.ingredients.map((ingredient) => (
            <Text
              key={ingredient}
              className="text-slate-400 font-body text-base leading-6"
            >
              {"\u2022"}
              {ingredient}
            </Text>
          ))}
        </ScrollView>
      </View>

      <View className="p-5 pb-8 gap-5">
        <Button onPress={handleAddToCart}>
          <Button.Icon>
            <Feather name="plus-circle" size={20} />
          </Button.Icon>
          <Button.Text>Adicionar ao pedido</Button.Text>
        </Button>

        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  );
}
