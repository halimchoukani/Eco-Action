import { Button, Toast, useToastState, XStack, YStack } from "tamagui"

export const CurrentToast = () => {
    const currentToast = useToastState()

    if (!currentToast || currentToast.isHandledNatively) return null

    return (
        <Toast
            key={currentToast.id}
            duration={currentToast.duration}
            viewportName={currentToast.viewportName}
            enterStyle={{ opacity: 0, scale: 0.95, y: -20 }}
            exitStyle={{ opacity: 0, scale: 0.95, y: -20 }}
            y={0}
            opacity={1}
            scale={1}
            transition="quick"
            bg={'transparent'}
            paddingInline={"$0"}
            paddingBlock={"$0"}
        >
            <YStack
                style={{
                    backgroundColor: "#2D6B4F",
                    borderRadius: 12,
                    padding: 16,
                    minWidth: 300,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 5,
                }}
            >
                <XStack gap="$4" items="center" justify="space-between">
                    <YStack gap="$1" flex={1}>
                        <Toast.Title color="white" fontWeight="700">
                            {currentToast.title}
                        </Toast.Title>
                        {!!currentToast.message && (
                            <Toast.Description color="white" opacity={0.8}>
                                {currentToast.message}
                            </Toast.Description>
                        )}
                    </YStack>
                    <Toast.Action asChild altText="Dismiss toast">
                        <Button
                            size="$2"
                            bg="#112c20ff"
                            borderWidth={0}
                        >
                            <Toast.Description color="white">Dismiss</Toast.Description>
                        </Button>
                    </Toast.Action>
                </XStack>
            </YStack>
        </Toast>
    )
}