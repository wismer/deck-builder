class Card < ActiveRecord::Base
  belongs_to :expansion
  has_one :expansion

  ABILITIES = [
    "Flying", "Banding", "First Strike", "Double Strike", "Intimidate",
    "Hexproof", "Lifelink", "Trample", "Deathtouch", "Haste"
  ]

  self.primary_key = "multiverseid"

  ABILITIES.each do |ability|
    self.send(:define_method, "#{ability.downcase.gsub(" ", "_")}?", ->() {
      self.card_text == "" ? false : self.card_text.split("\n").any? { |line| line =~ Regexp.new(ability, "i") }
    })
  end

  def card_types
    super.split(", ") if super
  end

  def card_colors
    super || ""
  end

  def card_subtype
    super.split(", ") if super
  end

  def supertypes
    super.split(", ") if super
  end

  def card_text
    super.nil? ? "" : super
  end

  def mana_cost
    if super
      super.split(/[\{\}]/).select { |x| x.length > 0 }.map do |mana|
        case mana
        when "G"
          "Green"
        when "U"
          "Blue"
        when "W"
          "White"
        when "B"
          "Black"
        when "R"
          "Red"
        else
          mana
        end
      end
    else
      []
    end
  end

  def method_missing(type, *args)
    # if !self.respond_to?(type)

  end
end
