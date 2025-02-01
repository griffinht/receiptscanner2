import { useState } from 'react'
import { ChakraProvider, Box, VStack, Heading, Button, Image, Text, Container, SimpleGrid, Progress, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Badge, Stat, StatLabel, StatNumber, StatHelpText, Divider, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'

// Create a theme instance
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50'
      }
    }
  }
})

function App() {
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)

  const handleCapture = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
      setIsLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('receipt', file)

      try {
        const response = await fetch('/api/analyze-receipt', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`Failed to analyze receipt: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setAnalysis(data)
      } catch (error) {
        console.error('Error analyzing receipt:', error)
        setError(error.message || 'Failed to analyze receipt. Please try again.')
        setAnalysis(null)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.md" py={8}>
        <VStack spacing={6}>
          <Heading>Receipt Scanner</Heading>
          
          <Box w="full" textAlign="center">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCapture}
              style={{ display: 'none' }}
              id="capture"
            />
            <Button as="label" htmlFor="capture" colorScheme="blue" size="lg">
              Take Receipt Photo
            </Button>
          </Box>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          )}

          {image && (
            <Box w="full">
              <Image src={image} alt="Receipt" maxH="300px" mx="auto" />
            </Box>
          )}

          {isLoading && (
            <Box w="full">
              <Text mb={2}>Analyzing receipt...</Text>
              <Progress size="xs" isIndeterminate />
            </Box>
          )}

          {analysis && (
            <Box w="full" p={6} bg="white" borderWidth={1} borderRadius="lg" shadow="md">
              <VStack spacing={6} align="stretch">
                {/* Store Info & Total */}
                <Box textAlign="center">
                  <Heading size="md">Whole Foods Market</Heading>
                  <Text color="gray.600" fontSize="sm">3540 Wade Ave, Raleigh</Text>
                  <Stat mt={4}>
                    <StatLabel>Total Spent</StatLabel>
                    <StatNumber fontSize="3xl" color="blue.600">$90.16</StatNumber>
                    <StatHelpText>
                      <Badge colorScheme="green">Saved $4.50</Badge>
                    </StatHelpText>
                  </Stat>
                </Box>

                <Divider />

                {/* Smart Categories */}
                <Box>
                  <Heading size="md" mb={4}>Spending Categories</Heading>
                  <SimpleGrid columns={1} spacing={4}>
                    <Box p={4} borderWidth={1} borderRadius="md" bg="red.50">
                      <Text fontWeight="bold">Meat & Protein</Text>
                      <Text>$36.85 (41%)</Text>
                      <Progress value={41} size="sm" colorScheme="red" mt={2} />
                      <Text fontSize="sm" color="gray.600" mt={2}>Ribeye Steak, Chicken Thigh, Eggs</Text>
                    </Box>
                    <Box p={4} borderWidth={1} borderRadius="md" bg="green.50">
                      <Text fontWeight="bold">Produce</Text>
                      <Text>$16.42 (18%)</Text>
                      <Progress value={18} size="sm" colorScheme="green" mt={2} />
                      <Text fontSize="sm" color="gray.600" mt={2}>Carrots, Spinach, Tomatoes, Mandarins, Bananas, Onions, Apples</Text>
                    </Box>
                    <Box p={4} borderWidth={1} borderRadius="md" bg="yellow.50">
                      <Text fontWeight="bold">Snacks & Pantry</Text>
                      <Text>$16.57 (18%)</Text>
                      <Progress value={18} size="sm" colorScheme="yellow" mt={2} />
                      <Text fontSize="sm" color="gray.600" mt={2}>Granola, Dark Chocolate, Kefir</Text>
                    </Box>
                    <Box p={4} borderWidth={1} borderRadius="md" bg="purple.50">
                      <Text fontWeight="bold">Household</Text>
                      <Text>$11.79 (13%)</Text>
                      <Progress value={13} size="sm" colorScheme="purple" mt={2} />
                      <Text fontSize="sm" color="gray.600" mt={2}>Kitchen Bags</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Insights Accordion */}
                <Accordion allowMultiple>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Text fontWeight="bold">Shopping Insights</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <VStack align="stretch" spacing={3}>
                        <Box>
                          <Text fontWeight="bold" color="red.500">Most Expensive Item</Text>
                          <Text>Ribeye Steak ($23.09)</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="green.500">Best Savings</Text>
                          <Text>Mandarin 3LB - Saved $1.50</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" color="blue.500">Tax Breakdown</Text>
                          <Text>7.25% Tax: $1.09</Text>
                          <Text>2.00% Tax: $1.45</Text>
                        </Box>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  )
}

export default App
